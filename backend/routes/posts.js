const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import Post model (created below)
const Post = require('../models/Post');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error('Get post error:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    
    const newPost = new Post({
      title,
      content,
      excerpt,
      author: 'Marc' // In a real app, this would be from authenticated user
    });
    
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error('Create post error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Update post
    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.updatedAt = Date.now();
    
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Update post error:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error('Delete post error:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
