const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const serviceProviderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: {
      url: String,
      filename: String,
    },
    experience: { type: Number, required: true },
    Address: {
      State: { type: String, required: true },
      District: { type: String, required: true },
      Local: { type: String, required: true },
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },

    // Only one service allowed with pricing model
    service: {
      name: {
        type: String,
        enum: [
          "Mason",
          "Plumber",
          "Electrician",
          "Carpenter",
          "Painter",
          "House Cleaner",
          "Pest Control Specialist",
          "Interior Designer",
          "AC Repair Technician",
          "Car Washer",
          "Bike Mechanic",
          "Car Mechanic",
          "Auto Electrician",
          "Car Towing Service",
          "Babysitter",
          "Home Nurse",
          "Elderly Caregiver",
          "Fitness Trainer",
          "Yoga Instructor",
          "Massage Therapist",
          "Beautician",
          "Hair Stylist",
          "Makeup Artist",
          "Photographer",
          "Videographer",
          "Wedding Planner",
          "Event Decorator",
          "DJ & Sound System Provider",
          "Catering Services",
          "Private Tutor",
          "Music Teacher",
          "Dance Instructor",
          "Language Trainer",
          "Computer Repair Technician",
          "Mobile Repair Specialist",
          "CCTV Installation Technician",
          "Smart Home Installation Expert",
          "Packers & Movers",
          "Furniture Assembler",
          "Delivery Assistant",
          "Legal Consultant",
          "Tax Consultant",
          "Financial Advisor",
          "Security Guard",
          "Bouncer",
          "Cook/Chef",
          "Pet Trainer",
          "Gardener",
          "Laundry & Ironing Services",
          "Tailor",
        ],
        required: true,
      },
      pricingModel: { type: String, enum: ["Hourly", "Fixed"], required: true },
      price: { type: Number, required: true },
    },

    availability: { type: Boolean, default: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    earnings: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],

    rating: {
      average: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 }
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceProviderSchema.methods.generateAuthToken = function () {
  let token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

serviceProviderSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

serviceProviderSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
