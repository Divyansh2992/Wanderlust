const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,             //cloudinary configuration
    api_key: process.env.CLOUD_API_KEY,             //cloud_name,api_key and api_secret variable needs to be same everywhere in development
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats:["png","jpg","jpeg"] // supports promises as well
    },
  });

module.exports = {
    cloudinary,
    storage
};