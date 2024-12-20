const RewardHistory = require('../models/RewardHistory');

const rewardHistoryController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const query = {};
            const { playerId, rewardType, startDate, endDate } = req.query;
            
            if (playerId) query.playerId = playerId;
            if (rewardType) query.rewardType = rewardType;
            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate) query.timestamp.$gte = new Date(startDate);
                if (endDate) query.timestamp.$lte = new Date(endDate);
            }

            // Get total count for pagination
            const total = await RewardHistory.countDocuments(query);

            // Get paginated data
            const rewards = await RewardHistory.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit);

            // Send response with pagination metadata
            res.json({
                data: rewards,
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