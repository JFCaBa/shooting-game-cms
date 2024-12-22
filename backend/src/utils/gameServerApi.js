const jwt = require('jsonwebtoken');

class GameServerApi {
    constructor() {
        this.baseUrl = process.env.GAME_SERVER_URL;
    }

    generateServiceToken() {
        return jwt.sign(
            { 
                service: 'cms',
                timestamp: Date.now()
            },
            process.env.SERVICE_SECRET,
            { expiresIn: '1h' }
        );
    }

    async request(endpoint, options = {}) {
        const serviceToken = this.generateServiceToken();

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Service-Key': process.env.SERVICE_KEY,
                'Service-Token': serviceToken
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Game server request failed');
        }

        return response.json();
    }

    async get(endpoint) {
        return this.request(endpoint);
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

module.exports = new GameServerApi();