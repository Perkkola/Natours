const mongoose = require('mongoose')

const bookingsSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        reqired: [true, 'Booking must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        reqired: [true, 'Booking must belong to a user']
    },
    price: {
        type: Number,
        require: [true, 'Booking must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
})

bookingsSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    })
    next()
})

const Bookings = mongoose.model('Bookings', bookingsSchema)

module.exports = Bookings