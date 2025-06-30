// routes/adminRouter.js
const express = require("express");
const router = express.Router();
const adminController = require("../controller/Admin.controller");

// Add dashboard stats route
router.get("/", adminController.getDashboardStats);
router.get("/users", adminController.getAllServiceProviders);

//report
router.get("/reports/monthly", adminController.getMonthlyCompletedServices);
router.get("/reports/distribution", adminController.getServiceTypeDistribution);
router.get("/reports/top-providers", adminController.getTopServiceProviders);


module.exports = router;