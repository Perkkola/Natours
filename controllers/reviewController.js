const mongoose = require("mongoose");
const express = require("express");
const Review = require("../models/reviewModel.js");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReviewById = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);

// exports.getReviewById = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);
//   // Review.findOne({_id: req.params.id})

//   if (!review) {
//     return next(new AppError("No review found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       review,
//     },
//   });
// });
