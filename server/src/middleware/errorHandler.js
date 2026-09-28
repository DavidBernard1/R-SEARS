function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV === 'development';
  
  console.error('[ERROR]', {
    message: err.message,
    stack: isDev ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const response = {
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack })
  };

  res.status(statusCode).json(response);
}

module.exports = { errorHandler };
