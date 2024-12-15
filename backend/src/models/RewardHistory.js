const mongoose = require('mongoose');

const rewardHistorySchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true,
        index: true
    },
    rewardType: {
        type: String,
        required: true,
        enum: ['HIT', 'KILL', 'AD_WATCH', 'DAILY_LOGIN', 'ACHIEVEMENT']
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient querying by playerId and timestamp
rewardHistorySchema.index({ playerId: 1, timestamp: -1 });

module.exports = mongoose.model('RewardHistory', rewardHistorySchema);