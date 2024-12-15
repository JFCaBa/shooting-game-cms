const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatTimestamp = (date) => {
  return new Date(date).toISOString();
};

const filterObject = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

module.exports = {
  validateEmail,
  formatTimestamp,
  filterObject
};
