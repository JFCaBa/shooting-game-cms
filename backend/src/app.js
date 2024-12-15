const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Import routes
const droneRoutes = require('./routes/droneRoutes');
const playerRoutes = require('./routes/playerRoutes');
const tokenBalanceRoutes = require('./routes/tokenBalanceRoutes');
const rewardHistoryRoutes = require('./routes/rewardHistoryRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/players', authMiddleware, playerRoutes);
app.use('/api/drones', authMiddleware, droneRoutes);
app.use('/api/achievements', authMiddleware, achievementRoutes);
app.use('/api/rewards', authMiddleware, rewardHistoryRoutes);
app.use('/api/token-balances', authMiddleware, tokenBalanceRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Shooting Game CMS API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;