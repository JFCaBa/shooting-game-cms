const Achievement = require('../models/Achievement');

const achievementController = {
    async getAll(req, res) {
        try {
            const { playerId, type } = req.query;
            
            // Build query based on filters
            const query = {};
            if (playerId) query.playerId = playerId;
            if (type) query.type = type;

            const achievements = await Achievement.find(query)
                .sort({ unlockedAt: -1 });
            res.json(achievements);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const achievement = await Achievement.findById(req.params.id);
            if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
            res.json(achievement);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const achievement = new Achievement(req.body);
            const newAchievement = await achievement.save();
            res.status(201).json(newAchievement);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const achievement = await Achievement.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
            res.json(achievement);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const achievement = await Achievement.findByIdAndDelete(req.params.id);
            if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
            res.json({ message: 'Achievement deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getPlayerAchievements(req, res) {
        try {
            const { playerId } = req.params;
            const achievements = await Achievement.find({ playerId })
                .sort({ unlockedAt: -1 });
            res.json(achievements);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = achievementController;