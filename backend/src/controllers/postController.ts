import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { uploadSinglePhoto, deletePhotoFromS3 } from '../utils/s3.js';
import Post, { IPost } from '../models/Post.js';
import Image, { IImage } from '../models/Image.js';
import mongoose from 'mongoose';

export const createPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { description } = req.body;

    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized: missing userId' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const file: Express.Multer.File = req.file;
    const image = await uploadSinglePhoto(file, req.userId, 'posts');
    const post = new Post({
      description,
      photo: image._id,
      user: new mongoose.Types.ObjectId(req.userId as string),
    });
    await post.save();

    res.json({ message: 'Post created successfully', post: post });
  } catch (error) {
    res.status(500).json({
      message: 'Server error with creating post',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post Id' });
    }

    const post = await Post.findById(postId)
      .populate({
        path: 'user',
        select: 'userName avatar _id',
        populate: { path: 'avatar', select: 'url' }, 
      })
      .populate({ path: 'photo', select: 'url' });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error(
      'Error getting post by ID:',
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllPosts = async (_req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'user',
        select: 'userName avatar',
        populate: {
          path: 'avatar',
          select: 'url',
        },
      })
      .populate('photo')
      .sort({ createdAt: -1 })
      .exec();
    res.json(posts);
  } catch (error) {
    console.error(
      'Error getting all posts:',
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllPostsOneUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId })
      .populate('user', 'userName avatar')
      .populate('photo')
      .populate('comments.user', 'userName avatar')
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'This user has no posts yet' });
    }

    res.json(posts);
  } catch (error) {
    console.error(
      'Error getting user posts:',
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const description = req.body.description;

    if (!description && !req.file) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can update only your own post' });
    }

    if (description) {
      if (description.length > 1000) {
        return res
          .status(400)
          .json({ message: 'Description cannot exceed 1000 characters' });
      }
      post.description = description.trim();
    }

    if (req.file) {
      const file: Express.Multer.File = req.file;
      if (post.photo) {
        const oldPhoto = await Image.findById(post.photo);
        if (oldPhoto) {
          await deletePhotoFromS3(oldPhoto.filename);
          await oldPhoto.deleteOne();
        }
      }

      const newImage = await uploadSinglePhoto(file, req.userId, 'posts');
      post.photo = newImage._id as IImage;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'userName avatar')
      .populate('photo');

    res.json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error(
      'Error updating post description:',
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deletePostById = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can delete only your own post' });
    }
    if (post.photo) {
      const oldPhoto = await Image.findById(post.photo);
      if (oldPhoto) {
        await deletePhotoFromS3(oldPhoto.filename);
        await oldPhoto.deleteOne();
      }
    }

    await Post.deleteOne({ _id: postId });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(
      'Error deleting post:',
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};
