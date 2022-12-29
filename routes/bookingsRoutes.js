const express = require("express");
const bookingController = require("../controllers/bookingsController");
const auth = require("../controllers/authenticationController");

const router = express.Router();

router.use(auth.protect)

router.get('/checkout-session/:tourId',bookingController.getCheckout)

router.use(auth.restrictTo('admin', 'lead-guide'))

router.route('/').get(bookingController.getAllBookings).post(bookingController.createBooking)

router.route(':id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking)

module.exports = router;
