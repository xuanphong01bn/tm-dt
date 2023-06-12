import User from "../models/user";
import Cart from "../models/cart";
import Product from "../models/product";
import Coupon from "../models/coupon";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createPaymentStripe = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  let amountCart;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCart * 100,
    currency: "usd",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
module.exports = {
  createPaymentStripe: createPaymentStripe,
};
