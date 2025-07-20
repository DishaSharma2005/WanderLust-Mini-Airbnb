

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("✅ Connected to DB");

    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({ ...obj,owner:"68765128d3901d8879b3bc31"}))
    await Listing.insertMany(initData.data);
    console.log("✅ Data was initialized successfully");

    mongoose.connection.close(); // optional: close DB
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
