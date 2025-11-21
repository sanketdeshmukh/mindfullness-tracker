const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindfulness-tracker';

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  connectTimeoutMS: 5000
})
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error.message);
    console.error('⚠️  To enable data persistence:');
    console.error('   1. Install MongoDB Community Edition');
    console.error('   2. Run: mongod');
    console.error('   3. Restart this backend server');
  });

// Routes
const mindfulnessRoutes = require('./routes/mindfulnessRoutes');
app.use('/api/mindfulness', mindfulnessRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date(),
    database: {
      connected: dbConnected,
      status: dbConnected ? 'Connected' : 'Disconnected',
      uri: MONGODB_URI
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
