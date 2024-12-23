const { body, query, param, validationResult } = require('express-validator');

// Utility function to handle validation results
const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array()
        });
    };
};

// Pagination Validation
const paginationValidation = {
    validate: validate([
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ])
};

// Drone Validations
const droneValidation = {
    create: validate([
        body('droneId').notEmpty().withMessage('Drone ID is required'),
        body('playerId').notEmpty().withMessage('Player ID is required'),
        body('position.x').isNumeric().withMessage('Position X must be a number'),
        body('position.y').isNumeric().withMessage('Position Y must be a number'),
        body('position.z').isNumeric().withMessage('Position Z must be a number')
    ]),
    update: validate([
        param('id').notEmpty().withMessage('Drone ID is required'),
        body('position.x').optional().isNumeric().withMessage('Position X must be a number'),
        body('position.y').optional().isNumeric().withMessage('Position Y must be a number'),
        body('position.z').optional().isNumeric().withMessage('Position Z must be a number')
    ])
};

const geoObjectValidation = {
    create: validate([
        body('id').notEmpty().withMessage('ID is required'),
        body('type').isIn(['weapon', 'target', 'powerup']).withMessage('Invalid type'),
        body('coordinate.latitude').isFloat().withMessage('Latitude must be a number'),
        body('coordinate.longitude').isFloat().withMessage('Longitude must be a number'),
        body('coordinate.altitude').isFloat().withMessage('Altitude must be a number'),
        body('metadata.reward').optional().isNumeric().withMessage('Reward must be a number'),
        body('metadata.spawnedAt').optional().isISO8601().withMessage('Invalid date format')
    ]),
    update: validate([
        param('id').notEmpty().withMessage('ID is required'),
        body('type').optional().isIn(['weapon', 'target', 'powerup']).withMessage('Invalid type'),
        body('coordinate.latitude').optional().isFloat().withMessage('Latitude must be a number'),
        body('coordinate.longitude').optional().isFloat().withMessage('Longitude must be a number'),
        body('coordinate.altitude').optional().isFloat().withMessage('Altitude must be a number'),
        body('metadata.reward').optional().isNumeric().withMessage('Reward must be a number'),
        body('metadata.spawnedAt').optional().isISO8601().withMessage('Invalid date format')
    ]),
    assign: validate([
        body('playerId').notEmpty().withMessage('Player ID is required')
    ])
};

// Player Validations
const playerValidation = {
    getAll: paginationValidation.validate,
    create: validate([
        body('playerId').notEmpty().withMessage('Player ID is required'),
        body('walletAddress').optional().isString().withMessage('Wallet address must be a string'),
        body('pushToken').optional().isString().withMessage('Push token must be a string'),
        body('stats.kills').optional().isInt({ min: 0 }).withMessage('Kills must be a non-negative integer'),
        body('stats.hits').optional().isInt({ min: 0 }).withMessage('Hits must be a non-negative integer'),
        body('stats.deaths').optional().isInt({ min: 0 }).withMessage('Deaths must be a non-negative integer'),
        body('stats.droneHits').optional().isInt({ min: 0 }).withMessage('Drone hits must be a non-negative integer'),
        body('stats.accuracy').optional().isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0 and 100')
    ]),
    update: validate([
        param('id').notEmpty().withMessage('Player ID is required'),
        body('stats.kills').optional().isInt({ min: 0 }).withMessage('Kills must be a non-negative integer'),
        body('stats.hits').optional().isInt({ min: 0 }).withMessage('Hits must be a non-negative integer'),
        body('stats.deaths').optional().isInt({ min: 0 }).withMessage('Deaths must be a non-negative integer'),
        body('stats.droneHits').optional().isInt({ min: 0 }).withMessage('Drone hits must be a non-negative integer'),
        body('stats.accuracy').optional().isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0 and 100')
    ])
};

// Token Balance Validations
const tokenBalanceValidation = {
    create: validate([
        body('playerId').notEmpty().withMessage('Player ID is required'),
        body('pendingBalance').isNumeric().withMessage('Pending balance must be a number'),
        body('mintedBalance').isNumeric().withMessage('Minted balance must be a number')
    ]),
    update: validate([
        param('id').notEmpty().withMessage('Player ID is required'),
        body('pendingBalance').optional().isNumeric().withMessage('Pending balance must be a number'),
        body('mintedBalance').optional().isNumeric().withMessage('Minted balance must be a number')
    ])
};

// Reward History Validations
const rewardHistoryValidation = {
    create: validate([
        body('playerId').notEmpty().withMessage('Player ID is required'),
        body('rewardType').isIn(['HIT', 'KILL', 'AD_WATCH', 'DAILY_LOGIN', 'ACHIEVEMENT'])
            .withMessage('Invalid reward type'),
        body('amount').isNumeric().withMessage('Amount must be a number')
    ]),
    update: validate([
        param('id').notEmpty().withMessage('Reward ID is required'),
        body('rewardType').optional().isIn(['HIT', 'KILL', 'AD_WATCH', 'DAILY_LOGIN', 'ACHIEVEMENT'])
            .withMessage('Invalid reward type'),
        body('amount').optional().isNumeric().withMessage('Amount must be a number')
    ]),
    getAll: validate([
        query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
        query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
        query('rewardType').optional().isIn(['HIT', 'KILL', 'AD_WATCH', 'DAILY_LOGIN', 'ACHIEVEMENT'])
            .withMessage('Invalid reward type')
    ])
};

// Achievement Validations
const achievementValidation = {
    create: validate([
        body('playerId').notEmpty().withMessage('Player ID is required'),
        body('type').isIn(['kills', 'hits', 'survivalTime', 'accuracy'])
            .withMessage('Invalid achievement type'),
        body('milestone').isNumeric().withMessage('Milestone must be a number'),
        body('nftTokenId').optional().isString().withMessage('NFT token ID must be a string')
    ]),
    update: validate([
        param('id').notEmpty().withMessage('Achievement ID is required'),
        body('type').optional().isIn(['kills', 'hits', 'survivalTime', 'accuracy'])
            .withMessage('Invalid achievement type'),
        body('milestone').optional().isNumeric().withMessage('Milestone must be a number'),
        body('nftTokenId').optional().isString().withMessage('NFT token ID must be a string')
    ])
};

module.exports = {
    playerValidation,
    droneValidation,
    geoObjectValidation,
    playerValidation,
    tokenBalanceValidation,
    rewardHistoryValidation,
    achievementValidation
};