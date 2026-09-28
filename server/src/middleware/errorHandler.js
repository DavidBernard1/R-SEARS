function errorHandler(err, req, res, next) {
  console.error('API Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
}

module.exports = { errorHandler };
