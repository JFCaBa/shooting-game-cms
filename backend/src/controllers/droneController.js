// src/controllers/droneController.js
const Drone = require('../models/Drone');

const droneController = {
    async getAll(req, res) {
        try {
            const drones = await Drone.find().sort({ createdAt: -1 });
            res.json(drones);
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

