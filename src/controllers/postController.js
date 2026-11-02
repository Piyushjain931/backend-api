const mongoose = require('mongoose');
const Post = require('../models/Post');

function validatePostFields(body, partial = false) {
  const allowed = ['name', 'description', 'age'];
  const unknown = Object.keys(body).filter((key) => !allowed.includes(key));
  if (unknown.length) return `Unknown field(s): ${unknown.join(', ')}.`;
  if (partial && Object.keys(body).length === 0) return 'Provide at least one field to update.';
  for (const field of allowed) {
    if (partial && !(field in body)) continue;
    if (!(field in body)) return `${field} is required.`;
    if (field === 'age') {
      if (typeof body.age !== 'number' || !Number.isFinite(body.age) || body.age < 0 || body.age > 150) {
        return 'age must be a number between 0 and 150.';
      }
    } else if (typeof body[field] !== 'string' || !body[field].trim()) {
      return `${field} must be a non-empty string.`;
    }
  }
  return null;
}

function validId(id) { return mongoose.isValidObjectId(id); }

async function createPost(req, res, next) {
  try {
    const issue = validatePostFields(req.body);
    if (issue) return res.status(400).json({ message: issue });
    const post = await Post.create({ ...req.body, author: req.user.id });
    return res.status(201).json({ message: 'Post created successfully.', post });
  } catch (error) { next(error); }
}

async function getPosts(req, res, next) {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    return res.json({ count: posts.length, posts });
  } catch (error) { next(error); }
}

async function getPost(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid post ID.' });
    const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    return res.json({ post });
  } catch (error) { next(error); }
}

async function updatePost(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid post ID.' });
    const issue = validatePostFields(req.body, true);
    if (issue) return res.status(400).json({ message: issue });
    const updates = { ...req.body };
    if (typeof updates.name === 'string') updates.name = updates.name.trim();
    if (typeof updates.description === 'string') updates.description = updates.description.trim();
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id }, updates,
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    return res.json({ message: 'Post updated successfully.', post });
  } catch (error) { next(error); }
}

async function deletePost(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid post ID.' });
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    return res.json({ message: 'Post deleted successfully.' });
  } catch (error) { next(error); }
}

module.exports = { createPost, getPosts, getPost, updatePost, deletePost };
