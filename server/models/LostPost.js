// LostPost.js
const mongoose = require('mongoose');

const LostPostSchema = new mongoose.Schema({
  title: String,
  description: String,
  contact: String,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '365d' } // expires after 365 days
  }
});

module.exports = mongoose.model('LostPost', LostPostSchema);
