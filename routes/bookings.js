const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing'); // adjust path if needed
const { isLoggedin } = require('../middleware');

console.log("isLoggedIn middleware loaded:", typeof isLoggedIn); // should be 'function'

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

// Handle booking submission
router.post('/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  // TODO: Save booking to DB later if needed

  req.flash('success', 'Booking successful!');
  res.redirect(`/listings/${id}`);
});

module.exports = router;
