// routes/admin.js
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isAdmin, isLoggedin } = require("../middleware");

router.get("/dashboard", isLoggedin, isAdmin, async (req, res) => {
  const listings = await Listing.find({}).populate("owner");
  const reviews = await Review.find({}).populate("author listing");
  res.render("admin/dashboard", { listings, reviews });
});

router.delete("/listings/:id", isLoggedin, isAdmin, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted by Admin.");
  res.redirect("/listings");
});

router.delete("/reviews/:id", isLoggedin, isAdmin, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  req.flash("success", "Review deleted by Admin.");
  res.redirect("/listings");
});

module.exports = router;
