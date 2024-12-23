const gameServerApi = require('../utils/gameServerApi');
const logger = require('../utils/logger');
require('dotenv').config();

class GeoObjectService {
  constructor() {
    this.baseUrl = process.env.GAME_SERVER_URL;
  }
    async addGeoObject(configData) {
      let url = 'https://api.shootingdapp.com/api/v1/geo-objects/add';
      console.log(`Adding Geo Object: ${JSON.stringify(configData)}`);
      console.log(`to URL: ${url}`);
        try {
          await gameServerApi.post(url, configData);
        } catch (error) {
          logger.error('Error adding Geo Object:', error);
          throw error;
        }
      }
}

module.exports = new GeoObjectService();