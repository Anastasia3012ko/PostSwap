import { Response } from "express";
import Like from "../models/Like.js";
import Post from "../models/Post.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export const addLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const like = new Like({ user: userId, post: postId });
    await like.save();

    // получаем обновленный likesCount из поста
    const post = await Post.findById(postId).select("likesCount");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(201).json({
      message: "Like added",
      likesCount: post.likesCount,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already liked" });
    }
    console.error("Error adding like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const like = await Like.findOneAndDelete({ user: userId, post: postId });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    const post = await Post.findById(postId).select("likesCount");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Like removed",
      likesCount: post.likesCount,
    });
  } catch (error: any) {
    console.error("Error removing like:", error);
    res.status(500).json({ message: "Server error" });
  }
};