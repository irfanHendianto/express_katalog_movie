const cloudinary = require('cloudinary').v2;
const configs = require('../config');

cloudinary.config({ 
    cloud_name: configs.cloud_name, 
    api_key: configs.api_key, 
    api_secret: configs.api_secret 
});

module.exports = cloudinary;