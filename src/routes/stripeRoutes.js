import express from 'express';

import * as stripePayment from '../controllers/stripeController.js';

const router = express.Router();

router.post('/checkout', stripePayment.checkout);

export { router as stripeRouter };

/*
import express from "express";
import Stripe from "stripe";

// TODO: have to pass my stripe key
const stripe = new Stripe(process.env.STRIPE_KEY);
const router = express.Router();

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

export { router as stripeRoute };
*/
