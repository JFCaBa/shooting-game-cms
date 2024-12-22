const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/positions', authMiddleware, async (req, res) => {
    try {
        const positions = await Player.find({}, {
            playerId: 1,
            position: 1,
            lastActive: 1
        });
        res.json(positions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/position/:playerId', authMiddleware, async (req, res) => {
    try {
        const { x, y, z } = req.body;
        const player = await Player.findOneAndUpdate(
            { playerId: req.params.playerId },
            {
                $set: {
                    'position.x': x,
                    'position.y': y,
                    'position.z': z,
                    'position.lastPositionUpdate': Date.now(),
                    lastActive: Date.now()
                }
            },
            { new: true }
        );
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;