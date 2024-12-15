const RewardHistory = require('../models/RewardHistory');

const rewardHistoryController = {
    async getAll(req, res) {
        try {
            const { playerId, rewardType, startDate, endDate } = req.query;
            
            // Build query based on filters
            const query = {};
            if (playerId) query.playerId = playerId;
            if (rewardType) query.rewardType = rewardType;
            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate) query.timestamp.$gte = new Date(startDate);
                if (endDate) query.timestamp.$lte = new Date(endDate);
            }

            const rewards = await RewardHistory.find(query)
                .sort({ timestamp: -1 });
            res.json(rewards);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const reward = await RewardHistory.findById(req.params.id);
            if (!reward) return res.status(404).json({ message: 'Reward history not found' });
            res.json(reward);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const reward = new RewardHistory(req.body);
            const newReward = await reward.save();
            res.status(201).json(newReward);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const reward = await RewardHistory.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!reward) return res.status(404).json({ message: 'Reward history not found' });
            res.json(reward);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const reward = await RewardHistory.findByIdAndDelete(req.params.id);
            if (!reward) return res.status(404).json({ message: 'Reward history not found' });
            res.json({ message: 'Reward history deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getPlayerStats(req, res) {
        try {
            const { playerId } = req.params;
            const stats = await RewardHistory.aggregate([
                { $match: { playerId } },
                { $group: {
                    _id: '$rewardType',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }}
            ]);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = rewardHistoryController;