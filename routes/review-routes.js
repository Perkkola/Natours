const express = require("express");
const reviewController = require("../controllers/reviewController");
const auth = require("./../controllers/authenticationController");

const router = express.Router({ mergeParams: true });

router.use(auth.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    auth.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .delete(auth.restrictTo("user", "admin"), reviewController.deleteReview)
  .patch(auth.restrictTo("user", "admin"), reviewController.updateReview);

module.exports = router;
