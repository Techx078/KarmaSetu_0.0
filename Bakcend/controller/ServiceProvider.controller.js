const { registerServiceProviderSchema } = require("../Validators/spRegistration.Validators")
const ServiceProviderModel = require("../models/ServiceProvider");
const sm = require("../models/Service");
const BlackListToken = require("../models/BlackListToken");
const { cloudinary } = require("../cloudConfig");
const fs = require("fs").promises;
const AppError = require("../utility/AppError")
const catchAsync = require('../utility/catchAsync')

module.exports.register = catchAsync(async (req, res, next) => {

  const { error } = registerServiceProviderSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const {
    firstName, lastName, email, phone, password,
    State, District, Local, experience,
    serviceName, pricingModel, price,
    latitude, longitude,
  } = req.body;

  // ✅ Check if email already exists
  const existingSP = await ServiceProviderModel.findOne({ email });
  if (existingSP) {
    return next(new AppError("Email already registered!", 400));
  }

  // ✅ Hash password
  const hashPassword = await ServiceProviderModel.hashPassword(password);

  // ✅ Process profile image
  let profileImage = { filename: "", url: "" };
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "service_providers",
      transformation: [
        { width: 200, height: 200, crop: "fill" },
        { quality: "auto" },
      ],
    });
    profileImage = {
      filename: req.file.originalname,
      url: result.secure_url,
    };
    await fs.unlink(req.file.path);
  }

  const service = {
    name: serviceName,
    pricingModel,
    price,
  };

  const Address = {
    State,
    District,
    Local,
  };

  const location = {
    latitude,
    longitude,
  };

  const newSP = new ServiceProviderModel({
    firstName,
    lastName,
    email,
    phone,
    password: hashPassword,
    profileImage,
    location,
    experience,
    Address,
    service,
  });

  const SPdb = await newSP.save();

  await sm.findOneAndUpdate(
    { name: serviceName },
    { $push: { providers: SPdb._id } },
    { new: true, useFindAndModify: false }
  );

  const token = await SPdb.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, SPdb });
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password){
      return next(new AppError(" email or password is not present", 400));
  }
  // Check if service provider exists
  const serviceProvider = await ServiceProviderModel.findOne({ email }).select("+password");
  if (!serviceProvider) {
    return next(new AppError("Invalid email or password", 400));
  }

  // Verify password
  const isMatch = await serviceProvider.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 400));
  }

  // Generate token
  const token = await serviceProvider.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({ token, serviceProvider });
});

module.exports.prof2 = catchAsync(async (req, res, next) => {
  // Use req.serviceProvider set by UserAuth middleware
  const serviceProvider = req.serviceProvider;
  if (!serviceProvider) {
    return next(new AppError("serviceProvider not found", 404));
  }
  res.status(200).json({ serviceProvider });
});

module.exports.profile = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const sp = await ServiceProviderModel.findById(id);
  if (!sp) {
    return next(new AppError("Service Provider not found", 404));
  }
  res.status(200).json({ sp });
});

module.exports.getAllServiceProviders = catchAsync(async (req, res, next) => {
  const serviceProviders = await ServiceProviderModel.find();
  res.status(200).json({ serviceProviders });
});

module.exports.logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new AppError("Please login first", 401));
  }

  // Blacklist token and clear cookies
  await BlackListToken.create({ token });
  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully, token blacklisted" });
});

module.exports.addService = catchAsync(async (req, res, next) => {
  const services = [
    { name: "Mason", icon: "FaHardHat" },
    { name: "Plumber", icon: "FaWrench" },
    { name: "Electrician", icon: "FaBolt" },
    { name: "Carpenter", icon: "FaHammer" },
    { name: "Painter", icon: "FaPaintRoller" },
    { name: "House Cleaner", icon: "FaBroom" },
    { name: "Pest Control Specialist", icon: "FaSpider" },
    { name: "Interior Designer", icon: "FaChair" },
    { name: "AC Repair Technician", icon: "FaSnowflake" },
    { name: "Car Washer", icon: "FaCar" },
    { name: "Bike Mechanic", icon: "FaMotorcycle" },
    { name: "Car Mechanic", icon: "FaTools" },
    { name: "Auto Electrician", icon: "FaCarBattery" },
    { name: "Car Towing Service", icon: "FaTruck" },
    { name: "Babysitter", icon: "FaBaby" },
    { name: "Home Nurse", icon: "FaUserNurse" },
    { name: "Elderly Caregiver", icon: "FaHandsHelping" },
    { name: "Fitness Trainer", icon: "FaDumbbell" },
    { name: "Yoga Instructor", icon: "FaPray" },
    { name: "Massage Therapist", icon: "FaHandHoldingHeart" },
    { name: "Beautician", icon: "FaSpa" },
    { name: "Hair Stylist", icon: "FaCut" },
    { name: "Makeup Artist", icon: "FaStar" },
    { name: "Photographer", icon: "FaCamera" },
    { name: "Videographer", icon: "FaVideo" },
    { name: "Wedding Planner", icon: "FaRing" },
    { name: "Event Decorator", icon: "FaGift" },
    { name: "DJ & Sound System Provider", icon: "FaMusic" },
    { name: "Catering Services", icon: "FaUtensils" },
    { name: "Private Tutor", icon: "FaBook" },
    { name: "Music Teacher", icon: "FaGuitar" },
    { name: "Dance Instructor", icon: "FaTheaterMasks" },
    { name: "Language Trainer", icon: "FaLanguage" },
    { name: "Computer Repair Technician", icon: "FaLaptopCode" },
    { name: "Mobile Repair Specialist", icon: "FaMobileAlt" },
    { name: "CCTV Installation Technician", icon: "FaVideo" },
    { name: "Smart Home Installation Expert", icon: "FaHome" },
    { name: "Packers & Movers", icon: "FaBoxes" },
    { name: "Furniture Assembler", icon: "FaCouch" },
    { name: "Delivery Assistant", icon: "FaTruckMoving" },
    { name: "Legal Consultant", icon: "FaBalanceScale" },
    { name: "Tax Consultant", icon: "FaFileInvoiceDollar" },
    { name: "Financial Advisor", icon: "FaMoneyCheckAlt" },
    { name: "Security Guard", icon: "FaShieldAlt" },
    { name: "Bouncer", icon: "FaUserShield" },
    { name: "Cook/Chef", icon: "FaUtensilSpoon" },
    { name: "Pet Trainer", icon: "FaDog" },
    { name: "Gardener", icon: "FaSeedling" },
    { name: "Laundry & Ironing Services", icon: "FaTshirt" },
    { name: "Tailor", icon: "FaCut" }
  ];

  const result = await sm.insertMany(services);
  res.status(201).json(result);
});

module.exports.getServices = catchAsync(async (req, res, next) => {
  const result = await sm.find();
  res.status(200).json({ result });
});

module.exports.getService = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const service = await sm.findById(id).populate("providers");
  if (!service) {
    return next(new AppError("Service not found", 404));
  }
  res.status(200).json({ service });
});
