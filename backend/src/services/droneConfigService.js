// cms/src/services/DroneConfigService.js
const gameServerApi = require('../utils/gameServerApi');
const logger = require('../utils/logger');

class DroneConfigService {
    async updateConfig(configData) {
        try {
            // Update local CMS database
            const localConfig = await DroneConfig.findOneAndUpdate(
                {},
                configData,
                { new: true, upsert: true }
            );

            // Sync with game server
            await gameServerApi.put('/api/drone-config', configData);

            return localConfig;
        } catch (error) {
            logger.error('Error updating drone config:', error);
            throw error;
        }
    }

    async getConfig() {
        try {
            // Get config from game server
            const gameServerConfig = await gameServerApi.get('/api/drone-config');
            
            // Sync with local database
            const localConfig = await DroneConfig.findOneAndUpdate(
                {},
                gameServerConfig,
                { new: true, upsert: true }
            );

            return localConfig;
        } catch (error) {
            logger.error('Error fetching drone config:', error);
            throw error;
        }
    }
}

module.exports = new DroneConfigService();