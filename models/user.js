const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// username + hash/salt come from the plugin — don't redefine username here
userSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  usernameUnique: true,
  usernameLowerCase: true,
  usernameCaseInsensitive: true,
  // allow login with either username or email
  usernameQueryFields: ["username", "email"],
  errorMessages: {
    IncorrectUsernameError: "No account found with that username or email.",
    IncorrectPasswordError: "Incorrect password. Please try again.",
    MissingUsernameError: "Please enter your username or email.",
    MissingPasswordError: "Please enter your password.",
    UserExistsError: "A user with the given username is already registered.",
  },
});

module.exports = mongoose.model("User", userSchema);
