const mongoose = require("mongoose");

let sampleData = [
  {
    "firstName": "Kunal",
    "lastName": "Singh",
    "email": "kunal.singh@example.com",
    "phone": "9856321470",
    "password": "hashedpassword",
    "profileImage": "kunal.jpg",
    "location": { "latitude": 26.9124, "longitude": 75.7873 },
    "service": { "name": "Electrician", "pricingModel": "Hourly", "price": 700 },
    "availability": true,
    "bookings": [],
    "earnings": 8700,
    "reviews": [],
    "notifications": [],
    "isVerified": false,
    "isActive": true,
    //"userId": new mongoose.Types.ObjectId() // ✅ Generate unique userId
  },
  {
    "firstName": "Ayesha",
    "lastName": "Khan",
    "email": "ayesha.khan@example.com",
    "phone": "9784521365",
    "password": "hashedpassword",
    "profileImage": "ayesha.jpg",
    "location": { "latitude": 23.0225, "longitude": 72.5714 },
    "service": { "name": "Makeup Artist", "pricingModel": "Fixed", "price": 3000 },
    "availability": true,
    "bookings": [],
    "earnings": 15000,
    "reviews": [],
    "notifications": [],
    "isVerified": true,
    "isActive": true,
   // "userId": new mongoose.Types.ObjectId() // ✅ Generate unique userId
  }
];

module.exports = { data: sampleData };
