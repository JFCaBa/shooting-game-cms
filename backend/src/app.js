const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Import routes
const droneRoutes = require('./routes/droneRoutes');
const playerRoutes = require('./routes/playerRoutes');
const tokenBalanceRoutes = require('./routes/tokenBalanceRoutes');
const rewardHistoryRoutes = require('./routes/rewardHistoryRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

const app = express();
const PORT = process.env.PORT || 3150;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/drones', droneRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/token-balances', tokenBalanceRoutes);
app.use('/api/reward-history', rewardHistoryRoutes);
app.use('/api/achievements', achievementRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Shooting Game CMS API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;