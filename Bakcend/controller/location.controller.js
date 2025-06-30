const axios = require('axios');
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const AppError = require("../utility/AppError")
const catchAsync = require('../utility/catchAsync')

const getSuggestions = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new AppError('Query parameter is required', 400));
  }

  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: `${query}, India`,
      format: 'json',
      addressdetails: 1,
      limit: 5,
      countrycodes: 'in',
    },
    headers: { "User-Agent": "KarmaSetuApp/1.0" },
    timeout: 5000,
  });

  if (!response.data || !Array.isArray(response.data)) {
    return next(new AppError('Invalid response from geocoding service', 502));
  }

  res.json(response.data);
});

const getAddressFromId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('ID parameter is required', 400));
  }

  let latitude, longitude, source = "";

  const user = await User.findById(id);
  if (user && user.location?.latitude && user.location?.longitude) {
    latitude = user.location.latitude;
    longitude = user.location.longitude;
    source = "user";
  }

  if (!latitude || !longitude) {
    const sp = await ServiceProvider.findById(id);
    if (sp && sp.location?.latitude && sp.location?.longitude) {
      latitude = sp.location.latitude;
      longitude = sp.location.longitude;
      source = "service_provider";
    }
  }

  if (!latitude || !longitude) {
    return next(new AppError("ID not found or location missing", 404));
  }

  const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: {
      lat: latitude,
      lon: longitude,
      format: "json",
      addressdetails: 1,
    },
    headers: { "User-Agent": "KarmaSetuApp/1.0" },
    timeout: 5000,
  });

  if (!response.data || !response.data.address) {
    return next(new AppError("Invalid response from reverse geocoding service", 502));
  }

  const address = response.data.address;

  res.json({
    source,
    full_address: response.data.display_name || '',
    city: address.city || address.town || address.village || '',
    state: address.state || '',
    district: address.county || '',
    country: address.country || '',
    postcode: address.postcode || '',
  });
});

module.exports = { getSuggestions, getAddressFromId };
