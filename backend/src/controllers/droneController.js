// src/controllers/droneController.js
const Drone = require('../models/Drone');

const droneController = {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Get total count for pagination
            const total = await Drone.countDocuments();

            // Get paginated data with sort
            const drones = await Drone.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            // Send response with pagination metadata
            res.json({
                data: drones,
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
            const drone = await Drone.findOne({ droneId: req.params.id });
            if (!drone) return res.status(404).json({ message: 'Drone not found' });
            res.json(drone);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const drone = new Drone(req.body);
            const newDrone = await drone.save();
            res.status(201).json(newDrone);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const drone = await Drone.findOneAndUpdate(
                { droneId: req.params.id },
                req.body,
                { new: true }
            );
            if (!drone) return res.status(404).json({ message: 'Drone not found' });
            res.json(drone);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const drone = await Drone.findOneAndDelete({ droneId: req.params.id });
            if (!drone) return res.status(404).json({ message: 'Drone not found' });
            res.json({ message: 'Drone deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = droneController;

