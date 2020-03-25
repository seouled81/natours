const stripe = Stripe('pk_test_jqtBB6dYbTq53iWaTJsvMByM006afw9wkh');
import axios from 'axios';
import { showAlert } from './alerts';

const bookTour = async tourId => {
  try {
    // 1. Get session from backend
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

    // 2. Load stripe checkout form and charge credit card
  } catch (err) {
    showAlert('error', 'Oops, something went wrong, please try later!');
  }
};

export default bookTour;
