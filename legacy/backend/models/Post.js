const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Post', postSchema); 