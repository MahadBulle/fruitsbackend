
const dotenv = require('dotenv');

dotenv.config();

const dbURL = process.env.MONGO_URL;
const port = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  dbURL,
  port,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
