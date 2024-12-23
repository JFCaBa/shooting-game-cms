require('dotenv').config();
const axios = require('axios');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const url =  process.env.GAME_SERVER_URL;

const gameServer = {

  generateServiceToken() {
    const secret = process.env.SERVICE_SECRET;
    if (!secret) {
        console.error('SERVICE_SECRET is missing.');
        throw new Error('SERVICE_SECRET is not configured');
    }
    return jwt.sign(
        {
            service: 'cms',
            timestamp: Date.now(),
        },
        secret,
        { expiresIn: '1h' }
    );
  },

 async makeRequest(method, endpoint, data = null) {
  const serviceToken = this.generateServiceToken();
  const headers = {
    'service-key': process.env.SERVICE_KEY,
    'service-token': serviceToken,
    'Content-Type': 'application/json'
  };

  try {
  logger.info('Game server request:', { method, url, endpoint, headers, data });
    const response = await axios({
      method,
      url: `${url}${endpoint}`,
      headers,
      data,
      validateStatus: status => status < 500
    });
    logger.info('Game server response:', response.data);
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
      return this.makeRequest('POST', '/geo-objects/assign', {
        playerId: data.playerId,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          altitude: data.location.altitude
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