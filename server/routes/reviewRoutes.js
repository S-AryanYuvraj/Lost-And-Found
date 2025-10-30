const express = require('express');
const router = express.Router();
const multer = require('multer');
const Review = require('../models/Review');

const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/reviews');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // creates folder if missing
}


// Multer setup
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, 'uploads/reviews'); },
  filename: function(req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// GET all reviews
router.get('/', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

// POST review with optional image
router.post('/', upload.single('image'), async (req, res) => {
  const { message } = req.body;
  const image = req.file ? `/uploads/reviews/${req.file.filename}` : null;
  const review = new Review({ message, image });
  await review.save();
  res.json(review);
});

module.exports = router;
