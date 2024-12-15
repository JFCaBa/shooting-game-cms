const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['kills', 'hits', 'survivalTime', 'accuracy'],
        required: true
    },
    milestone: {
        type: Number,
        required: true
    },
    unlockedAt: {
        type: Date,
        default: Date.now
    },
    nftTokenId: {
        type: String,
        default: null
    }
});

// Index for efficient querying of player achievements
achievementSchema.index({ playerId: 1, type: 1 });
// Index for searching by unlock date
achievementSchema.index({ unlockedAt: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);