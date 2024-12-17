const Player = require('../models/Player');

const playerController = {
    async getAll(req, res) {
        try {
            // Get pagination parameters from query string
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Get total count for pagination
            const total = await Player.countDocuments();

            // Get paginated data
            const players = await Player.find()
                .sort({
                    'stats.kills': -1,
                    'stats.hits': -1,
                    'stats.droneHits': -1
                })
                .skip(skip)
                .limit(limit);

            // Send response with pagination metadata
            res.json({
                data: players,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Rest of the controller methods remain the same
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