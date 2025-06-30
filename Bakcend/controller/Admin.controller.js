// controllers/admin.controller.js
const Booking = require("../models/BookingRequest");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Service = require("../models/Service");
const ServiceProvider = require("../models/ServiceProvider");
const AppError = require("../utility/AppError")
const catchAsync = require('../utility/catchAsync')

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const [revAgg] = await Payment.aggregate([
    { $match: { status: "Completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revAgg?.total ?? 0;

  const [
    activeUsers,
    pendingRequests,
    completedRequests,
    totalServices,
    ongoingServices,
  ] = await Promise.all([
    User.countDocuments(),
    Booking.countDocuments({ status: "Pending" }),
    Booking.countDocuments({ status: "Completed" }),
    Service.countDocuments(),
    Booking.countDocuments({ status: "Ongoing" }),
  ]);

  const revenuePerMonth = await Payment.aggregate([
    { $match: { status: "Completed" } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = revenuePerMonth.map(m => ({
    month: months[m._id - 1],
    revenue: m.revenue,
  }));

  res.json({
    totalRevenue,
    activeUsers,
    pendingRequests,
    completedRequests,
    totalServices,
    ongoingServices,
    revenueData,
  });
});

exports.getAllServiceProviders = catchAsync(async (req, res, next) => {
  const providers = await ServiceProvider.find({}, {
    firstName: 1,
    lastName: 1,
    "service.name": 1,
    "Address.State": 1,
    "Address.District": 1,
    experience: 1,
    "rating.average": 1,
  });

  const formatted = providers.map(p => ({
    name: `${p.firstName} ${p.lastName ?? ""}`.trim(),
    community: p.service.name,
    state: p.Address.State,
    city: p.Address.District,
    experience: p.experience,
    rating: p.rating.average,
  }));

  res.json(formatted);
});

exports.getMonthlyCompletedServices = catchAsync(async (req, res, next) => {
  const results = await Booking.aggregate([
    { $match: { status: "Paid" } },
    { $group: { _id: { $month: "$date" }, completed: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = results.map(r => ({
    month: months[r._id - 1],
    completed: r.completed,
  }));

  res.json(data);
});

exports.getServiceTypeDistribution = catchAsync(async (req, res, next) => {
  const results = await Booking.aggregate([
    { $match: { status: "Completed" } },
    { $group: { _id: "$serviceType", value: { $sum: 1 } } },
  ]);

  const data = results.map(r => ({ type: r._id, value: r.value }));
  res.json(data);
});

exports.getTopServiceProviders = catchAsync(async (req, res, next) => {
  const results = await Payment.aggregate([
    { $match: { status: "Completed" } },
    {
      $lookup: {
        from: "serviceproviders",
        localField: "serviceProvider",
        foreignField: "_id",
        as: "provider",
      },
    },
    { $unwind: "$provider" },
    {
      $group: {
        _id: {
          name: "$provider.name",
          serviceType: "$provider.serviceType",
        },
        completed: { $sum: 1 },
        avgRating: { $avg: "$provider.rating" },
        earnings: { $sum: "$amount" },
      },
    },
    { $sort: { completed: -1 } },
  ]);

  const formatted = {};
  results.forEach(r => {
    const key = r._id.serviceType || "Other";
    formatted[key] ??= [];
    formatted[key].push({
      name: r._id.name,
      completed: r.completed,
      rating: r.avgRating?.toFixed(1) ?? "N/A",
      earnings: `₹${r.earnings.toLocaleString()}`,
    });
  });

  res.json(formatted);
});

