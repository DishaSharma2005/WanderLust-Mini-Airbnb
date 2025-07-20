const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://www.istockphoto.com/photo/deserted-coastline-gm2191707061-610018592?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fbeach&utm_medium=affiliate&utm_source=unsplash&utm_term=beach%3A%3A%3A"
    }
  },
  price: Number,
  location: String,
  country: String ,
  reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    }
  ],
  owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: false
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: false
  }
}

});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
 
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
