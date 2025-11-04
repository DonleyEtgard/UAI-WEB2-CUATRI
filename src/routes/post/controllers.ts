import { Request, Response } from 'express';
import User from '../../models/User';
import Post from '../../models/Post';

const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const post = new Post({ title, content, author: user._id });
    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      data: post,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: true });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;
    let filter = {};
    if (title) {
      filter = { title: { $regex: title as string, $options: 'i' } };
    }
    const posts = await Post.find(filter).populate('author', 'name lastName email');
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: true });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'name lastName email');
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

const hardDeletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

const softDeletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error soft-deleting post", error });
  }
};

export default { createPost, getAllPosts, getPostById, updatePost, hardDeletePost, softDeletePost };