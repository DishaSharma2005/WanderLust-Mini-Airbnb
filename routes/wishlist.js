const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const User = require("../models/user");
const { isLoggedin } = require("../middleware");

router.post("/wishlist/:id/toggle", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  const index = user.wishlist.indexOf(id);
  if (index === -1) {
    user.wishlist.push(id);
    req.flash("success", "Added to wishlist!");
  } else {
    user.wishlist.splice(index, 1);
    req.flash("info", "Removed from wishlist.");
  }

  await user.save();
  res.redirect(req.get("Referer") || "/listings");

});

router.get("/wishlist", isLoggedin, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  console.log("✅ Wishlist Items:", user.wishlist);

 res.render("user/wishlist", { wishlist: user.wishlist });

});

module.exports = router;
