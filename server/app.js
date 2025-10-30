const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db'); // connect to MongoDB
const { PORT } = require('./config');

const postRoutes = require('./routes/postRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
