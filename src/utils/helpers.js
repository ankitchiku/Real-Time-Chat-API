/**
 * Utility helper functions
 */

const formatResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

const formatError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  formatResponse,
  formatError,
  asyncHandler
};