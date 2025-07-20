const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressErrors.js");
const {listingSchema}=require("../schema.js");
const Listing =require("../models/listing.js");
const Review =require("../models/review.js");
const {isLoggedin,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const {storage}=require("../cloudConfig.js");

const multer  = require('multer')
const upload = multer({storage})


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        req.flash("error", errMsg);
        return res.redirect("/listings/new"); 
    }
    next();
};

router.route("/") // Index route //Create Route
.get(wrapAsync (listingController.index) )
.post(  isLoggedin, upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//New route
router.get("/new",isLoggedin,listingController.renderNewForm);


router.route("/:id")//Show , Update, Delete
.get( wrapAsync(listingController.showListing))
.put( isLoggedin,isOwner, upload.single("listing[image]"),wrapAsync(listingController.updateListing))
.delete(isLoggedin, isOwner,wrapAsync(listingController.deleteListing));





//Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;
