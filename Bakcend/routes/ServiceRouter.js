const express = require("express");
const router = express.Router();
const ServiceProviderController = require("../controller/ServiceProvider.controller");
const ServiceProviderValidator = require("../models/validators/ServiceProvider.validators");
const ServiceProviderAuth = require("../Middleware/ServiceProviderAuth.MiddleWare");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const Uploads = multer({ storage });

router.post(
  "/register",
  ServiceProviderValidator.serviceProviderValidationRules,
  Uploads.single("file"),

  ServiceProviderController.register
);
router.post(
  "/login",
  ServiceProviderValidator.serviceProviderValidationRulesLogin,
  ServiceProviderController.login
);
router.get("/prof2",ServiceProviderAuth.ServiceProviderAuth,ServiceProviderController.prof2)
router.get(
  "/profile/:id",
  
  ServiceProviderController.profile
);
router.post("/add-service",ServiceProviderController.addService);
router.get("/get-service/:id",ServiceProviderController.getService);
router.get("/get-services",ServiceProviderController.getServices);
router.get("/service-providers", ServiceProviderController.getAllServiceProviders);
router.post("/logout", ServiceProviderController.logout);



module.exports = router;
//,Uploads.single("ServiceProvider[profileImage]")
