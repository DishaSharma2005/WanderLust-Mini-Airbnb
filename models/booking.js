const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  nights: Number,
  basePrice: Number,
  taxAmount: Number,
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre("validate", function (next) {
  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    this.invalidate("checkOut", "Check-out date must be after check-in date.");
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
