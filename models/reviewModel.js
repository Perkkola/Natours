const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A Review must content"],
      trim: true,
      // validate: [validator.isAlpha, "Name must not contain numbers"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "must be above 1"],
      max: [5, "must be below 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must have a writer"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //this.r = await this.findOne(); Does not work, query already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
  // console.log(stats);
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

//   this.populate({
//     path: "user",
//     select: "name photo",
//   }).populate({
//     path: "tour",
//     select: "name",
//   });
