const Player = require('../models/Player');

const tokenBalanceController = {
    // Get all balances sorted by totalBalance and mintedBalance
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Get total count for pagination
            const total = await Player.countDocuments();

            // Get paginated data
            const balances = await Player.find(
                {}, 
                { playerId: 1, pendingBalance: 1, mintedBalance: 1 }
            )
                .sort({
                    mintedBalance: -1,
                    pendingBalance: -1
                })
                .skip(skip)
                .limit(limit);

            // Send response with pagination metadata
            res.json({
                data: balances,
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
    // Get a specific player's balance
    async getOne(req, res) {
        try {
            const balance = await Player.findOne(
                { playerId: req.params.id },
                { playerId: 1, pendingBalance: 1, mintedBalance: 1 }
            );
            if (!balance) return res.status(404).json({ message: 'Player balance not found' });
            res.json(balance);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new player balance
    async create(req, res) {
        try {
            const player = new Player({
                playerId: req.body.playerId,
                pendingBalance: req.body.pendingBalance || 0,
                mintedBalance: req.body.mintedBalance || 0,
                lastUpdate: Date.now()
            });
            const newPlayer = await player.save();
            res.status(201).json(newPlayer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update an existing player's balance
    async update(req, res) {
        try {
            const updatedPlayer = await Player.findOneAndUpdate(
                { playerId: req.params.id },
                {
                    $set: {
                        pendingBalance: req.body.pendingBalance,
                        mintedBalance: req.body.mintedBalance,
                        lastUpdate: Date.now()
                    }
                },
                { new: true }
            );
            if (!updatedPlayer) return res.status(404).json({ message: 'Player balance not found' });
            res.json(updatedPlayer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete a player's balance
    async delete(req, res) {
        try {
            const deletedPlayer = await Player.findOneAndDelete({ playerId: req.params.id });
            if (!deletedPlayer) return res.status(404).json({ message: 'Player balance not found' });
            res.json({ message: 'Player balance deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = tokenBalanceController;