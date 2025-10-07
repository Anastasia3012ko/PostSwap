import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import User, { IUser } from '../models/User.js';
import Image, { IImage } from '../models/Image.js';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';
import  '../models/Follow.js';
import { uploadSinglePhoto, deletePhotoFromS3 } from '../utils/s3.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';


export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const requestedUserId = req.params.userId;
    const authUserId = req.userId;
    console.log('Requested ID:', req.params.userId);


    if (!requestedUserId || !mongoose.Types.ObjectId.isValid(requestedUserId)) {
      return res.status(400).json({ message: 'Invalid user Id' });
    }

    const user = await User.findById(requestedUserId)
      .select('-password -resetCode -resetCodeExpires')
      .populate({ path: 'avatar', select: 'url filename' })
      .populate({
        path: 'followers',
        populate: {
          path: 'follower',
          select: 'fullName userName avatar',
          populate: { path: 'avatar', select: 'url filename' },
        },
      })
      .populate({
        path: 'following',
        populate: {
          path: 'following',
          select: 'fullName userName avatar',
          populate: { path: 'avatar', select: 'url filename' },
        },
      })
      .populate({
        path: 'posts',
        select: 'description createdAt',
        populate: { path: 'photo', select: 'url filename' },
      });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isFollowing = authUserId
      ? await Follow.exists({ follower: authUserId, following: requestedUserId })
      : false;

    const postCount = await Post.countDocuments({ user: requestedUserId });

    res.json({
      ...user.toJSON(),
      postCount,
      isFollowing,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Server error',
        error: error instanceof Error ? error.message : error,
      });
  }
};

export const updateAvatarOnly = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('req.file:', req.file);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user Id' });
    }

    if (req.userId !== userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can update only your profile' });
    }

    const user = await User.findById(userId).populate<{ avatar: IImage | null }>('avatar');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No avatar file uploaded' });
    }

    // delete old avatar
    if (user.avatar) {
      await deletePhotoFromS3(user.avatar.filename);
      await Image.findByIdAndDelete(user.avatar._id);
    }

    // new avatar
    const file: Express.Multer.File = req.file;
    const newImage: IImage = await uploadSinglePhoto(file, userId, 'avatar');

    (user as IUser).avatar = newImage._id as Types.ObjectId;
    await user.save();

    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('avatar');

    res.json({
      message: 'Avatar updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { userName, fullName, about, website } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user Id' });
    }

    if (req.userId !== userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can update only your profile' });
    }

    const user = await User.findById(userId).populate<{
      avatar: IImage | null;
    }>('avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData: Partial<IUser> & { avatar?: Types.ObjectId } = {}; // partial make all field in object optional
    if (userName) updateData.userName = userName;
    if (fullName) updateData.fullName = fullName;
    if (about) {
      if (about.length > 150) {
        return res
          .status(400)
          .json({ message: 'About cannot exceed 150 characters' });
      }
      updateData.about = about;
    }
    if (website) updateData.website = website;

    if (req.file) {
      const file: Express.Multer.File = req.file;
      const avatar = user.avatar;
      if (avatar) {
        await deletePhotoFromS3(avatar.filename);
        await Image.findByIdAndDelete(avatar._id);
      }

      const newImage: IImage = await uploadSinglePhoto(file, userId, 'avatar');
      if (newImage) {
        updateData.avatar = newImage._id as Types.ObjectId;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('avatar');

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error with updating user profile');
    res
      .status(500)
      .json({
        message: 'Server error',
        error: error instanceof Error ? error.message : error,
      });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query } = req.body as { query?: string };

    if (!query || query.trim().length < 2) {
      res.status(200).json([]);
      return;
    }
    console.log(req.body);
    

    const trimmedQuery = query.trim();

    const users = await User.find(
      { userName: { $regex: trimmedQuery, $options: 'i' } },
      { userName: 1, avatar: 1 } 
    ).populate('avatar');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error with searching users:', error, req.body);
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};