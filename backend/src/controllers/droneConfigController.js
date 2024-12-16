// src/controllers/droneConfigController.js
const DroneConfig = require('../models/DroneConfig');
const DroneConfigService = require('../services/droneConfigService');


exports.updateConfig = async (req, res) => {
    try {
        const config = await DroneConfigService.updateConfig(req.body);
        res.json(config);
    } catch (error) {
        logger.error('Error in updateConfig:', error);
        if (error.message.includes('Game server')) {
            res.status(502).json({ error: 'Failed to sync with game server' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const droneConfigController = {
    async getConfig(req, res) {
        try {
            let config = await DroneConfig.findOne();
            if (!config) {
                // Create default config if none exists
                config = await DroneConfig.create({});
            }
            res.json(config);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateConfig(req, res) {
        try {
            const config = await DroneConfig.findOneAndUpdate(
                {},
                { ...req.body, updatedAt: Date.now() },
                { new: true, upsert: true }
            );
            res.json(config);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = droneConfigController;