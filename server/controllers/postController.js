const LostPost = require('../models/LostPost');
const FoundPost = require('../models/FoundPost');
const { sanitize } = require('../utils');
const { ADMIN_TOKEN } = require('../config');

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { title, description, contact, type } = req.body;
    if (!title || !description || !contact || !type)
      return res.status(400).json({ error: 'Missing fields' });

    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const doc = {
      title: sanitize(title),
      description: sanitize(description),
      contact: sanitize(contact),
      images,
    };

    const post = type === 'lost'
      ? await LostPost.create(doc)
      : await FoundPost.create(doc);

    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// List posts with search, pagination
// List posts with search, pagination
exports.listPosts = async (req, res) => {
  try {
    const { type, q = '', page = 1, limit = 10 } = req.query;
    const model = type === 'lost' ? LostPost : FoundPost;

    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    };

    let posts = await model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit);

    // convert relative paths → absolute URLs
    posts = posts.map(p => ({
      ...p.toObject(),
      images: p.images.map(img =>
        img.startsWith('http')
          ? img
          : `http://localhost:5000${img}`
      )
    }));

    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


// Get single post
exports.getPost = async (req, res) => {
  try {
    const { type, id } = req.params;
    const model = type === 'lost' ? LostPost : FoundPost;
    const post = await model.findById(id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Delete post (admin only)
exports.deletePost = async (req, res) => {
  try {
    if (req.headers['x-admin-token'] !== ADMIN_TOKEN)
      return res.status(403).json({ error: 'Forbidden' });

    const { type, id } = req.params;
    const model = type === 'lost' ? LostPost : FoundPost;
    await model.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
