import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import User, { IUser } from '../models/User.js';
import Image, { IImage } from '../models/Image.js';
import Post from '../models/Post.js';
import  '../models/Follow.js';
import { uploadSinglePhoto, deletePhotoFromS3 } from '../utils/s3.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const requestedUserId = req.params.userId;
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
    const postCount = await Post.countDocuments({ user: requestedUserId });

    res.json({ user, postCount });
  } catch (error) {
    res
      .status(500)
      .json({
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

    res.json({ message: 'Profile updated', user: updatedUser });
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
