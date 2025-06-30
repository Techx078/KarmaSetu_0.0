const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    phone: {
      type: String,
      required: true,
      //unique: true,
      // match: /^[6-9]\d{9}$/
    },
    password: { type: String, required: true, select: false },
    profileImage: {
      url: String,
      filename: String,
    },
    Address: {
      State: {
        type: String,
        required: true,
      },
      District: {
        type: String,
        required: true,
      },
      Local: {
        type: String,
        required: true,
      },
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  let token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.comparepassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
module.exports = mongoose.model("User", userSchema);
