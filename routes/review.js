const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressErrors.js");
const {reviewSchema}=require("../schema.js");
const Review =require("../models/review.js");
const Listing =require("../models/listing.js");
const  {isLoggedin,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        return  new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Reviews 
//Post Review route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview));

//Delete Review route
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
