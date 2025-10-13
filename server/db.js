const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');

mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.once('open', () => console.log('✅ MongoDB connected'));
db.on('error', (err) => console.error('MongoDB error:', err));

module.exports = db;
