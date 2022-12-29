const AppError = require("../utils/appError.js");

const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const msg = `Duplicate field value: ${value[0]} Please use another value`;
  return new AppError(msg, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  console.log(errors);
  const msg = `Invalid input data. ${errors.join(". ")}.`;
  return new AppError(msg, 400);
};

const handeJWTError = () =>
  new AppError("Invalid token. Please login again.", 401);

const handleJWTExpired = () =>
  new AppError("Your token has expired. Please log in again.", 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api") || req.url.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //DREDNDERED
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api") || req.url.startsWith("/api")) {
    //operational, trusted error: send message to client
    console.error(err);
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //programming or other unkown error: dont leak error details
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  //programming or other unkown error: dont leak error details
  // console.error(err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "developement") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handeJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpired();

    sendErrorProd(error, req, res);
  }
};
