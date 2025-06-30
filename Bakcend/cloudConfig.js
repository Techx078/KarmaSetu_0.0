const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,     // From Cloudinary Dashboard
    api_key:process.env.CLOUDINARY_API_KEY,           // From Cloudinary Dashboard
    api_secret:process.env.CLOUDINARY_API_SECRET ,     // From Cloudinary Dashboard
  });
  // Multer setup for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
  });
  module.exports={
    storage,
    cloudinary,
  }