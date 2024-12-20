const getPaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};

const createPaginationResponse = (data, total, page, limit) => {
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

module.exports = {
    getPaginationParams,
    createPaginationResponse
};