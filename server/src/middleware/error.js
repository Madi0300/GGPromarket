export function notFoundHandler(req, res, next) {
  if (res.headersSent) {
    return next();
  }
  res.status(404).json({
    error: "ResourceNotFound",
    message: `Endpoint ${req.originalUrl} not found`,
  });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: err.code || "ServerError",
    message,
  });
}
