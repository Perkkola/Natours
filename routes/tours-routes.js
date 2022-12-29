const express = require("express");
const tourController = require("../controllers/tourController");
const auth = require("./../controllers/authenticationController");
const reviewController = require("./../controllers/reviewController");

const reviewRouter = require("./review-routes");
const router = express.Router();

// router.param("id", tourController.checkID);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    auth.protect,
    auth.restrictTo("admin", "leadGuide", "guide"),
    tourController.getMonthlyPlan
  );

router
  .route("/tours-distance/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    auth.protect,
    auth.restrictTo("admin", "leadGuide"),
    tourController.createTour
  );
  
router
  .route("/:id")
  .get(tourController.getTourById)
  .patch(
    auth.protect,
    auth.restrictTo("admin", "leadGuide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    auth.protect,
    auth.restrictTo("admin", "leadGuide"),
    tourController.deleteTour
  );

router.use("/:tourId/reviews", reviewRouter);
// router
//   .route("/:tourId/reviews")
//   .post(auth.protect, auth.restrictTo("user"), reviewController.createReview);

module.exports = router;
