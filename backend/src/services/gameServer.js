require('dotenv').config();

// services/gameServer.js
const axios = require('axios');
const logger = require('../utils/logger');

const gameServer = {
 async makeRequest(method, endpoint, data = null) {
   const headers = {
     'Service-Key': process.env.SERVICE_KEY,
     'Service-Secret': process.env.SERVICE_SECRET,
     'Content-Type': 'application/json'
   };

   try {
     const response = await axios({
       method,
       url: `${process.env.GAME_SERVER_URL}${endpoint}`,
       headers,
       data,
       validateStatus: status => status < 500
     });
     
     if (response.status === 401) {
       throw new Error('Game server authentication failed');
     }
     
     return response.data;
   } catch (error) {
     logger.error('Game server error:', {
       status: error.response?.status,
       data: error.response?.data,
       message: error.message
     });
     throw new Error(error.response?.data?.message || 'Game server communication failed');
   }
 },

async assignGeoObject(data) {
    try {
      logger.info('Calling game server:', {
        url: process.env.GAME_SERVER_URL,
        endpoint: '/geo-objects/assign',
        headers: {
          'Service-Key': process.env.SERVICE_KEY ? 'present' : 'missing',
          'Service-Secret': process.env.SERVICE_SECRET ? 'present' : 'missing'
        }
      });
      return this.makeRequest('POST', '/geo-objects/assign', {
        playerId: data.playerId,
        position: {
          lat: data.location.latitude,
          lng: data.location.longitude,
          alt: data.location.altitude
        }
      });
    } catch (error) {
      logger.error('Detailed error:', {
        error: error.message,
        response: error.response?.data,
        gameServerUrl: process.env.GAME_SERVER_URL
      });
      throw error;
    }
  }
};

module.exports = gameServer;