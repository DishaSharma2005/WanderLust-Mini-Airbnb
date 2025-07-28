const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing'); // adjust path if needed
const { isLoggedin } = require('../middleware');
const Booking = require('../models/booking'); // ⬅️ Import your model


// Show booking form
router.get('/:id/new', isLoggedin, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }
  res.render('user/booking', { listing }); // ✅ fixed folder name
});

// Save booking data
router.post('/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found.');
    return res.redirect('/listings');
  }

  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn,
    checkOut,
    guests
  });

  await booking.save();
  req.flash('success', 'Booking confirmed!');
  res.redirect('/booking/mine');
});

router.get('/mine', isLoggedin, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('listing');
  res.render('user/myBookings', { bookings });
});
router.delete('/:bookingId', isLoggedin, async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    req.flash('error', 'Booking not found!');
    return res.redirect('/booking/mine');
  }

  // Allow only the user who booked to cancel
  if (!booking.user.equals(req.user._id)) {
    req.flash('error', 'Unauthorized action!');
    return res.redirect('/booking/mine');
  }

  await Booking.findByIdAndDelete(bookingId);
  req.flash('success', 'Booking cancelled successfully!');
  res.redirect('/booking/mine');
});



module.exports = router;
