const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const { isLoggedin } = require("../middleware");
const Booking = require("../models/booking");
const { nightsBetween, priceBreakdown } = require("../utils/pricing");

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isValidBookingDates(checkIn, checkOut) {
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return { ok: false, message: "Please enter valid check-in and check-out dates." };
  }

  const today = startOfDay(new Date());
  const inDate = startOfDay(checkIn);
  const outDate = startOfDay(checkOut);

  if (inDate < today) {
    return { ok: false, message: "Check-in date cannot be in the past." };
  }

  if (outDate <= inDate) {
    return { ok: false, message: "Check-out date must be after check-in date." };
  }

  return { ok: true };
}

async function hasOverlap(listingId, checkInDate, checkOutDate, excludeId = null) {
  const query = {
    listing: listingId,
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  };
  if (excludeId) query._id = { $ne: excludeId };
  return Booking.exists(query);
}

router.get("/mine", isLoggedin, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ checkIn: 1 });
  res.render("user/myBookings", { bookings });
});

router.get("/:id/new", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const existing = await Booking.find({ listing: id })
    .select("checkIn checkOut")
    .sort({ checkIn: 1 });

  res.render("user/booking", {
    listing,
    existingBookings: existing,
    prefill: {
      checkIn: req.query.checkIn || "",
      checkOut: req.query.checkOut || "",
      guests: req.query.guests || "1",
    },
  });
});

router.post("/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const validation = isValidBookingDates(checkInDate, checkOutDate);

  if (!validation.ok) {
    req.flash("error", validation.message);
    return res.redirect(`/booking/${id}/new`);
  }

  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    req.flash("error", "Number of guests must be between 1 and 10.");
    return res.redirect(`/booking/${id}/new`);
  }

  if (await hasOverlap(id, checkInDate, checkOutDate)) {
    req.flash("error", "Those dates are already booked. Please pick different dates.");
    return res.redirect(`/booking/${id}/new`);
  }

  const nights = nightsBetween(checkInDate, checkOutDate);
  const pricing = priceBreakdown(listing.price, nights, guestCount);

  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests: guestCount,
    nights: pricing.nights,
    basePrice: pricing.base,
    taxAmount: pricing.tax,
    totalPrice: pricing.total,
  });

  await booking.save();
  req.flash(
    "success",
    `Booking confirmed for ${pricing.nights} night${pricing.nights === 1 ? "" : "s"} · ₹${pricing.total.toLocaleString("en-IN")} (incl. tax)`
  );
  res.redirect("/booking/mine");
});

router.delete("/:bookingId", isLoggedin, async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/booking/mine");
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "Unauthorized action!");
    return res.redirect("/booking/mine");
  }

  await Booking.findByIdAndDelete(bookingId);
  req.flash("success", "Booking cancelled successfully!");
  res.redirect("/booking/mine");
});

module.exports = router;
