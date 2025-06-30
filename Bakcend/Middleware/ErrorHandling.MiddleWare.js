// middlewares/errorHandler.js
module.exports = (err, _req, res, _next) => {
  const status = err.statusCode || 500;

  //⬇️ never leak stack traces in production
  console.error(`[${status}]`, err);

  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
