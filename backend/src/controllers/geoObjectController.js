const GeoObject = require('../models/GeoObject');
const logger = require('../utils/logger');
const gameServer = require('../services/gameServer');

const geoObjectController = {
    async assign(req, res) {
        try {
          logger.info('Assigning geo object:', req.body);
          const result = await gameServer.assignGeoObject(req.body);
          res.json(result);
        } catch (error) {
          logger.error('Failed to assign geo object:', error);
          res.status(error.response?.status || 500).json({ message: error.message });
        }
      },

    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Get total count for pagination
            const total = await GeoObject.countDocuments();

            // Get paginated data with sort
            const geoObjects = await GeoObject.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            // Send response with pagination metadata
            res.json({
                data: geoObjects,
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
            const geoObject = await GeoObject.findOne({ id: req.params.id });
            if (!geoObject) return res.status(404).json({ message: 'GeoObject not found' });
            res.json(geoObject);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const geoObject = await GeoObject.findOneAndUpdate(
                { id: req.params.id },
                req.body,
                { new: true }
            );
            if (!geoObject) return res.status(404).json({ message: 'GeoObject not found' });
            res.json(geoObject);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const geoObject = await GeoObject.findOneAndDelete({ id: req.params.id });
            if (!geoObject) return res.status(404).json({ message: 'GeoObject not found' });
            res.json({ message: 'GeoObject deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const geoObject = new GeoObject(req.body);
            const newGeoObject = await geoObject.save();
            res.status(201).json(newGeoObject);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

};

module.exports = geoObjectController;