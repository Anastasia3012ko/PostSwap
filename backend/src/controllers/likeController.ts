import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Post, { IPost } from '../models/Post.js';
import Like, { ILike } from '../models/Like.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

interface LikeInfo {
  likesCount: number;
  userLiked: boolean;
}

interface PostLean {
  _id: Types.ObjectId;
  likesCount: number;
}

export const getAllLikes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const posts = await Post.find({}, { likesCount: 1 })
      .lean<PostLean[]>()
      .exec();

    const postIds: Types.ObjectId[] = posts.map((post) => post._id);

    const userLikes: ILike[] = userId
      ? await Like.find({ user: userId, post: { $in: postIds } }).exec()
      : [];

    const result: Record<string, LikeInfo> = {};

    for (const post of posts) {
      const liked = userLikes.some(
        (like) => like.post.toString() === post._id.toString()
      );
      result[post._id.toString()] = {
        likesCount: post.likesCount || 0,
        userLiked: liked,
      };
    }

    res.json(result);
  } catch (err) {
    console.error('Error in getAllLikes:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;

    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const like = new Like({ user: userId, post: postId });
    await like.save();

    const postLikesCount = (await Like.find({ post: postId })).length;

    res.json({ postId, likesCount: postLikesCount });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already liked' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;

    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const like = await Like.findOne({ user: userId, post: postId });
    if (!like) return res.status(400).json({ message: 'Like not found' });

    await like.deleteOne();

    const postLikesCount = (await Like.find({ post: postId })).length;

    res.json({ postId, likesCount: postLikesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
