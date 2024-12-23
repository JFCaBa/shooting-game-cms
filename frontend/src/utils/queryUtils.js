export const buildQueryString = (page, filters = {}) => {
    const params = new URLSearchParams({
      page: page || 1,
      limit: filters.limit || 10,
      ...filters
    });
    return params.toString();
  };