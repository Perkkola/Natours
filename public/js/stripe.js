const stripe = Stripe('pk_test_51MIBQyIZBKGC8fZm7VJYJfm282Vn6TSxSUG6Qzr6XA8XKwJ3bs5MhL9xwiKh6Netmu15aUkf1rXPxZGn64YRRso000rMXz4LHF')
import axios from 'axios'
import { showAlert } from "./alerts";

export const bookTour = async tourId => {
// get checkout session from API
try {

    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`)
    console.log(session)
    //create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    })
} catch(err) {
    console.log(err.message)
    showAlert('error', err)
}
}