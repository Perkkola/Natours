const express = require("express");
const viewController = require("../controllers/viewsController");
const authController = require("../controllers/authenticationController");
const bookingsController = require("../controllers/bookingsController");

const router = express.Router();

router.get("/",bookingsController.createBookingCheckout ,authController.isLoggedIn, viewController.getOverview);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.login);
router.get("/me", authController.protect, viewController.getAcc);
router.get("/my-tours", authController.protect, viewController.getMyTours);

router.post(
  "/submit-user-data",
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
