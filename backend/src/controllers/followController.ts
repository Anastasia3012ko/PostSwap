import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import Follow from '../models/Follow.js';
import User from '../models/User.js';
import mongoose from 'mongoose';


export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(followingId)) {
          return res.status(400).json({ message: 'Invalid user Id' });
        }
    

    if (followerId === followingId) 
      return res.status(400).json({ message: 'You cannot follow yourself' });
    
     const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exists = await Follow.findOne({ follower: followerId, following: followingId });
    if (exists) return res.status(400).json({ message: 'Already following this user' });

    const follow = await Follow.create({ follower: followerId, following: followingId });
    res.status(201).json({ message: 'You are following', follow });

  } catch (error) {
    console.error('Error with subscribing to user', error);
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id;

    const follow = await Follow.findOne({ follower: followerId, following: followingId });
    if (!follow) return res.status(400).json({ message: 'You are not following this user' });

    await follow.deleteOne();
    res.status(200).json({ message: 'Unfollowed successfully' });

  } catch (error) {
    console.error('Error with subscribing to user', error);
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};
