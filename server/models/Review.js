const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  message: { type: String, required: true },
  image: { type: String }, // store file path or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
