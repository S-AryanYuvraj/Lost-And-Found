const express = require('express');
const multer = require('multer');
const {
  createPost,
  listPosts,
  getPost,
  deletePost
} = require('../controllers/postController');

const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
router.post('/', upload.array('photos', 5), createPost);
router.get('/', listPosts);
router.get('/:type/:id', getPost);
router.delete('/:type/:id', deletePost);

module.exports = router;
