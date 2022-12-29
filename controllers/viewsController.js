const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Bookings = require("../models/bookingsModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    field: "review rating user",
  });

  if (!tour) {
    return next(new AppError("No such tour exists"));
  }

  res.status(200).render("tour", {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.login = (req, res) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.getAcc = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.getMyTours =catchAsync( async (req, res, next) => {
  const bookings = await Bookings.find({user: req.user.id})

  const tourIDs = bookings.map(el => el.tour)
  const tours = await Tour.find({ _id: {$in: tourIDs}})

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  })
})

exports.updateUserData = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user,
  });
});
