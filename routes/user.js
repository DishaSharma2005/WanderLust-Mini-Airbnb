const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {saveRedirectUrl}=require("../middleware.js");
const wrapAsync=require("../utils/wrapAsync.js");
const userControllers=require("../controllers/user.js");

router.route("/signup")// Show signup form // Handle signup form submission
.get(wrapAsync(userControllers.renderSignup))
.post( wrapAsync(userControllers.signup));

router.route("/login")//login form //After Login 
.get(wrapAsync(userControllers.renderlogin))
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",failureFlash:true
}),wrapAsync(userControllers.login));


router.get("/logout",wrapAsync(userControllers.logout));
module.exports = router;
