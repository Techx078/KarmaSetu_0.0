const ServiceProviderModel = require("../models/ServiceProvider");

const createServiceProvider = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  profileImage,
  location,
  service,
}) => {
  const serviceProvider = await ServiceProviderModel.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    profileImage,
    location,
    service,
  });
  return serviceProvider;
};

module.exports = createServiceProvider;
