// middlewares/errorHandler.js
module.exports = (err, _req, res, _next) => {
  console.log("error hadler called");
  
  const status = err.statusCode || 500;

  console.log(err);
  
  
  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
