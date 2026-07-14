require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const geoDefaults = require("../utils/geoDefaults.js");

const sampleComments = [
  "Amazing stay, would come back!",
  "Super clean and great host.",
  "Perfect location for exploring.",
  "Beautiful place with wonderful views.",
  "Cozy and comfortable throughout.",
];

async function main() {
  try {
    const dbUrl = process.env.ATLAS_URL;
    if (!dbUrl) throw new Error("ATLAS_URL is missing in .env");

    await mongoose.connect(dbUrl);
    console.log("✅ Connected to DB");

    let owner = await User.findOne({ username: "demo" });
    if (!owner) {
      owner = new User({ email: "demo@wanderlust.com", username: "demo" });
      await User.register(owner, "demo123");
      console.log("✅ Created demo owner user (username: demo / password: demo123)");
    }

    // Ensure an admin account exists
    let admin = await User.findOne({ username: "admin" });
    if (!admin) {
      admin = new User({
        email: "admin@wanderlust.com",
        username: "admin",
        role: "admin",
      });
      await User.register(admin, "admin123");
      console.log("✅ Created admin user (username: admin / password: admin123)");
    } else if (admin.role !== "admin") {
      admin.role = "admin";
      await admin.save();
    }

    await Review.deleteMany({});
    await Listing.deleteMany({});

    const data = initData.data.map((obj) => {
      const coords = geoDefaults[obj.location] || [77.209, 28.6139];
      return {
        ...obj,
        owner: owner._id,
        geometry: { type: "Point", coordinates: coords },
      };
    });

    const listings = await Listing.insertMany(data);
    console.log(`✅ Inserted ${listings.length} listings`);

    const reviewers = [owner, admin];
    let reviewCount = 0;

    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const howMany = (i % 3) + 1;
      const reviewIds = [];

      for (let j = 0; j < howMany; j++) {
        const author = reviewers[j % reviewers.length];
        const review = new Review({
          comment: sampleComments[(i + j) % sampleComments.length],
          rating: 3 + ((i + j) % 3),
          author: author._id,
          listing: listing._id,
        });
        await review.save();
        reviewIds.push(review._id);
        reviewCount++;
      }

      listing.reviews = reviewIds;
      await listing.save();
    }

    console.log(`✅ Seeded ${reviewCount} reviews`);
    console.log("✅ Data was initialized successfully");
    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
