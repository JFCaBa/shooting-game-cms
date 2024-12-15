const TokenBalance = require('../models/TokenBalance');

const tokenBalanceController = {
    async getAll(req, res) {
        try {
            const balances = await TokenBalance.find();
            res.json(balances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const balance = await TokenBalance.findOne({ playerId: req.params.id });
            if (!balance) return res.status(404).json({ message: 'Token balance not found' });
            res.json(balance);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const balance = new TokenBalance(req.body);
            const newBalance = await balance.save();
            res.status(201).json(newBalance);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const balance = await TokenBalance.findOneAndUpdate(
                { playerId: req.params.id },
                {
                    ...req.body,
                    lastUpdate: Date.now()
                },
                { new: true }
            );
            if (!balance) return res.status(404).json({ message: 'Token balance not found' });
            res.json(balance);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const balance = await TokenBalance.findOneAndDelete({ playerId: req.params.id });
            if (!balance) return res.status(404).json({ message: 'Token balance not found' });
            res.json({ message: 'Token balance deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = tokenBalanceController;