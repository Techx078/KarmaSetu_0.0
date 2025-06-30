const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const { cloudinary } = require("../cloudConfig");
const fs = require("fs").promises;
const AppError = require("../utility/AppError")
const catchAsync = require('../utility/catchAsync')
const { registerUserSchema } = require("../Validators/userRegistration.Validator")

module.exports.register = catchAsync(async (req, res, next) => {

  const { error } = registerUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map(e => e.message).join(", ");
    return next(new AppError(message, 400));
  }

  const { firstName, lastName, email, phone, password, State, District, Local, latitude, longitude } = req.body;

  // ✅ Check if email already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  // ✅ Construct sub-documents
  const fullname = { firstName, lastName };
  const Address = { State, District, Local };
  const location = { latitude, longitude };
  const hashPassword = await UserModel.hashPassword(password);

  // ✅ Handle profile image
  let profileImage = { filename: "", url: "" };
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "service_providers",
      transformation: [
        { width: 200, height: 200, crop: "fill" },
        { quality: "auto" }
      ],
    });
    profileImage = {
      filename: req.file.originalname,
      url: result.secure_url,
    };
    await fs.unlink(req.file.path);
  }

  // ✅ Create new user
  const newUser = new UserModel({
    fullname,
    email,
    phone,
    password: hashPassword,
    profileImage,
    location,
    Address,
  });

  const savedUser = await newUser.save();
  const token = await savedUser.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ token, User: savedUser });
});

module.exports.login = catchAsync(async (req, res, next) => {
  
  const { email, password } = req.body;
  if(!email || !password){
    return next(new AppError(" email or password is not present", 400));
  }
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password", 400));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 400));
  }

  const token = await user.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ token, User: user });
});

module.exports.profile = catchAsync(async (req, res, next) => {
  const user = req.User;
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ user });
});

module.exports.get_user_profile = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await UserModel.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ user });
});
