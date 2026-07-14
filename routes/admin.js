const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");
const Booking = require("../models/booking");
const { isAdmin, isLoggedin } = require("../middleware");

router.get("/dashboard", isLoggedin, isAdmin, async (req, res) => {
  const [listings, reviews, users, bookings, bookingCount] = await Promise.all([
    Listing.find({}).populate("owner").sort({ title: 1 }),
    Review.find({}).populate("author listing").sort({ createdAt: -1 }).limit(50),
    User.countDocuments(),
    Booking.find({})
      .populate("listing")
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(20),
    Booking.countDocuments(),
  ]);

  res.render("admin/dashboard", {
    listings,
    reviews,
    bookings,
    stats: {
      listings: listings.length,
      reviews: await Review.countDocuments(),
      users,
      bookings: bookingCount,
    },
  });
});

router.delete("/listings/:id", isLoggedin, isAdmin, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted by Admin.");
  res.redirect("/admin/dashboard");
});

router.delete("/reviews/:id", isLoggedin, isAdmin, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review?.listing) {
    await Listing.findByIdAndUpdate(review.listing, { $pull: { reviews: review._id } });
  }
  await Review.findByIdAndDelete(req.params.id);
  req.flash("success", "Review deleted by Admin.");
  res.redirect("/admin/dashboard");
});

module.exports = router;
