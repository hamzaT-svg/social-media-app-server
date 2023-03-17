import mongoose from "mongoose";
import postMessage from "../model/postMessage.js";

// get Posts
export const getPosts = async (req, res) => {
  try {
    const postMessages = await postMessage.find();

    res.status(200).json(postMessages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create Post
export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new postMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
  try {
    await postMessage.findByIdAndUpdate(id, updatedPost, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send(err);
  }
};

// deletePost
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    const response = await postMessage.findByIdAndDelete(id);
    res.json(response);
  } catch (err) {
    res.status(501).send(err);
  }
};

// like post
export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!req.userId) {
    return res.json({ message: "Unauthorized User" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }
  try {
    const post = await postMessage.findById(id).lean();

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== req.userId);
    }

    const response = await postMessage.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
