if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}




const express =require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressErrors.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const adminRoutes = require("./routes/admin");


const session = require("express-session");
const flash = require("connect-flash");

const bookingRoutes = require('./routes/bookings.js');
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const wishlistRoutes = require("./routes/wishlist");

const dbUrl = process.env.ATLAS_URL;

const MongoStore = require('connect-mongo');

async function main() {
// console.log("Connecting to:", dbUrl); // Debug ke liye
  await mongoose.connect(dbUrl);
  console.log("connected to DB");
}
main().catch((err) => console.log(err));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionSecret = process.env.SECRET || process.env.SECERT || "wanderlustdevsecret";

const store=MongoStore.create({
  mongoUrl:dbUrl,crypto:{
    secret: sessionSecret,
  },touchAfter:24*3600,
})
store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
})

app.use(session({
  store,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,

  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    User.authenticate()
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  res.locals.currUser = req.user;
  next();
});
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Lightweight health check for Render / keep-alive pings
app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "wanderlust",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});


app.use("/listings",listingsRouter);
app.use("/", wishlistRoutes);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);
app.use('/booking', bookingRoutes);
app.use("/admin",adminRoutes);


app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;

    if (res.headersSent) {
        return next(err); // ✅ prevents crash
    }

    res.status(statusCode).render("listings/error.ejs", { err });
});



const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

// app.listen(8080,() =>{
//     console.log("server is listening to port 8080");
// })