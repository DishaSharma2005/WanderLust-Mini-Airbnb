const Listing =require("../models/listing.js");
const axios = require("axios");
const Review = require("../models/review.js");


module.exports.index = async (req, res) => {
    const { q, category, checkIn, checkOut, guests } = req.query;
    let filter = {};

    if (q) {
        const regex = new RegExp(q, "i");
        filter.$or = [{ title: regex }, { location: regex }, { country: regex }];
    }

    if (category) {
        filter.category = category;
    }

    let allListing = await Listing.find(filter).populate("reviews");

    // Hide listings that are fully booked for the selected date range
    if (checkIn && checkOut && checkOut > checkIn) {
        const Booking = require("../models/booking.js");
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const conflicts = await Booking.find({
            checkIn: { $lt: end },
            checkOut: { $gt: start },
        }).select("listing");
        const blockedIds = new Set(conflicts.map((b) => String(b.listing)));
        allListing = allListing.filter((listing) => !blockedIds.has(String(listing._id)));
    }

    const { CATEGORIES } = require("../utils/categories.js");

    const categorySections = CATEGORIES.map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        listings: allListing.filter((listing) => listing.category === cat.name),
    })).filter((section) => section.listings.length > 0);

    res.render("listings/index", {
        allListing,
        q,
        category,
        checkIn: checkIn || "",
        checkOut: checkOut || "",
        guests: guests || "",
        categories: CATEGORIES,
        categorySections,
    });
};

module.exports.renderNewForm = (req, res) => {
    const { CATEGORIES } = require("../utils/categories.js");
    return res.render("listings/new.ejs", { categories: CATEGORIES });
};
module.exports.showListing=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: { path: "author" } // 👈 this is critical
  }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    console.log("Owner:", listing.owner);

    res.render("listings/show.ejs", { listing });
});

module.exports.createListing = async (req, res) => {
  const { location } = req.body.listing;

  const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: location,
      format: "json",
      limit: 1
    },
    headers: {
      'User-Agent': 'Wanderlust App - Learning Project'
    }
  });

  const coordinates = geoRes.data[0]
    ? [parseFloat(geoRes.data[0].lon), parseFloat(geoRes.data[0].lat)]
    : [0, 0];

  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  // ✅ Check if an image was uploaded
  if (req.file) {
  listing.image = {
    url: req.file.path,
    filename: req.file.filename
  };
} else {
  listing.image = {
    url: "https://res.cloudinary.com/demo/image/upload/v1700000000/default-listing.jpg",
    filename: "default"
  };
}


  listing.geometry = {
    type: "Point",
    coordinates: coordinates
  };

  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${listing._id}`);
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    const { CATEGORIES } = require("../utils/categories.js");
    res.render("listings/edit.ejs", { listing, originalImageUrl, categories: CATEGORIES });
};

module.exports.updateListing=(async (req, res) => {
    const { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Delete reviews safely
  if (listing.reviews && listing.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
