// API creation file

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay.js");
// to store our order , we call the payment schema here
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants.js");
// used for webhook
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user.js");

// STEP 1 creating our create order API
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  // code to create order on razorpay
  try {
    // we will get the membershipType value from UI (Frontend) or postman that's why req.body is written
    const { membershipType } = req.body;
    // req.user is coming from userAuth fn
    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      // never pass amount from UI like we did for membership type otherwise attacker could attack
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        membershipType: membershipType,
      },
    });

    // console.log(order);

    // create payment

    const payment = new Payment({
      // req.user._id is coming from userAuth
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    // save order in database
    const savedPayment = await payment.save();

    // Return back my order details to front-end by below code in Premium.jsx

    res.json({ ...savedPayment.toJSON(), keyId: "rzp_test_SevRwvUvFOK9E1" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: err.message });
  }
});

// STEP : 2 ==> After config our webhook API on Razarpay dashboard ,we have created our webhook API,

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    //
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      "pkmb$123",
    );

    console.log("isWebhookValid===>", isWebhookValid);
    // webhook is way to commuicate to Backend and Frontend and inform user

    // if webhook is valid then only payment is captured and is either successful or failure.if webhook is invalid then throw status 400 error

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    // if webhook is valid then do below list of things

    // 1. update my payment status in Database.
    // 2. update user as premium
    // 3.  return success response to razorpay webhook.

    // Below is the response Webhook will send
    const paymentDetails = req.body.payload.payment.entity;

    // we will first  find the payment of particular order_id on database then update the status on database
    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });

    payment.status = paymentDetails.status;

    await payment.save();
    console.log("payment save");

    // find user on database
    //payment sai user_id mil rhi because userId is defined on payment schema
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();
    console.log("user save");

    // update user as premium

    // if (req.body.event === "payment.captured") {
    // }

    // if (req.body.event === "payment.failed") {
    // }

    //  return success response to razorpay webhook.
    return res.status(200).json({ msg: "Webhook Received Successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// STEP 3 : ===> Required for payment verification and change in UI

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  // userAuth hai that's why we are able to do req.user
  const user = req.user.toJSON();

  if (user.isPremium) {
    return res.json({ isPremium: true });
  } else {
    return res.json({ isPremium: false });
  }
});

module.exports = paymentRouter;
