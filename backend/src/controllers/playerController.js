// src/controllers/playerController.js
const Player = require('../models/Player');

const playerController = {
    async getAll(req, res) {
        try {
            const players = await Player.find().sort({
                'stats.kills': -1, // Sort by kills in descending order
                'stats.hits': -1,  // Sort by hits in descending order
                'stats.droneHits': -1 // Sort by droneHits in descending order
            });
            res.json(players);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const player = await Player.findOne({ playerId: req.params.id });
            if (!player) return res.status(404).json({ message: 'Player not found' });
            res.json(player);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const player = new Player(req.body);
            const newPlayer = await player.save();
            res.status(201).json(newPlayer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const player = await Player.findOneAndUpdate(
                { playerId: req.params.id },
                req.body,
                { new: true }
            );
            if (!player) return res.status(404).json({ message: 'Player not found' });
            res.json(player);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const player = await Player.findOneAndDelete({ playerId: req.params.id });
            if (!player) return res.status(404).json({ message: 'Player not found' });
            res.json({ message: 'Player deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = playerController;