// Here we will store the order details.
// For storing order details we created this schema

const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    // particular user ke liye ek order create hogga
    userId: {
      type: mongoose.Types.ObjectId,
      //Each payment should be linked to User schema
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
