const Tour = require("../models/tourModel.js");
const Bookings = require("../models/bookingsModel.js");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getCheckout = catchAsync(async (req, res, next) => {
//get currently booked tour
 const tour = await Tour.findById(req.params.tourId)
//create checkout session
 const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `${tour.name} Tour`
                },
                unit_amount: tour.price * 100,
            },
            quantity: 1
        }
    ],
    mode: 'payment'
 })
//create session as response
res.status(200).json({
    status: 'success',
    session
})
})

exports.createBookingCheckout =catchAsync( async (req, res, next) => {
    //temporary!! unsecure
    
    const {tour, user, price} = req.query
    if(!tour && !user && !price) return next()
    await Bookings.create({tour, user, price})

    res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking = factory.createOne(Bookings)
exports.getBooking = factory.getOne(Bookings)
exports.getAllBookings = factory.getAll(Bookings)
exports.updateBooking = factory.updateOne(Bookings)
exports.deleteBooking = factory.deleteOne(Bookings)