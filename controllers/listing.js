const Listing =require("../models/listing.js");
const axios = require("axios");


// module.exports.index=async(req,res)=>{
//     try {
//         const allListing = await Listing.find({});
//         console.log(allListing);
//         return res.render("listings/index.ejs", { allListing });
//     } catch (err) {
//         console.error("Error fetching listings:", err);
//         return res.status(500).send("Something went wrong while fetching listings.");
//     }
// }
module.exports.index = async (req, res) => {
    const { q } = req.query;
    let allListing;

    if (q) {
        const regex = new RegExp(q, 'i');
        allListing = await Listing.find({
            $or: [
                { title: regex },
                { location: regex }
            ]
        });
    } else {
        allListing = await Listing.find({});
    }
    
    res.render("listings/index", { allListing, q, currUser: req.user });

};

module.exports.renderNewForm=(req,res)=>{
     return res.render("listings/new.ejs");
}
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



module.exports.renderEditForm=(async(req,res)=>{
    let {id}=req.params;
     const listing = await Listing.findById(id);
     let originalImageUrl=listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
     res.render("listings/edit.ejs",{listing,originalImageUrl});
});

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

module.exports.deleteListing=(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
   if (Array.isArray(listing.reviews) && listing.reviews.length > 0) {
  await Review.deleteMany({ _id: { $in: listing.reviews } });
   }
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
});