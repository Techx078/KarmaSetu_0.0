const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
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
    icon: {
      type: String, // Store the icon name as a string, e.g., "FaHammer"
      required: true,
    },
    providers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider" },
    ], // All providers offering this service
  },
  { timestamps: true }
);

// Initialize entries for all services with their respective icons


module.exports = mongoose.model("Service", serviceSchema);
