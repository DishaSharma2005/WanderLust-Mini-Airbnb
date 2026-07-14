const User = require("../models/user");

module.exports.renderSignup = async (req, res) => {
  res.render("user/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    username = (username || "").trim();
    email = (email || "").trim().toLowerCase();
    password = password || "";

    if (!username || !email || !password) {
      req.flash("error", "Username, email, and password are required.");
      return res.redirect("/signup");
    }

    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect("/signup");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "An account with this email already exists. Please log in.");
      return res.redirect("/login");
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust! Your account was created.");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message || "Signup failed. Please try again.");
    res.redirect("/signup");
  }
};

module.exports.renderlogin = async (req, res) => {
  res.render("user/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to WanderLust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  // clear after use so it doesn't stick forever
  if (req.session.redirectUrl) {
    delete req.session.redirectUrl;
  }
  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
