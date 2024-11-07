import connectDB from '../utils/dbConnection.js';

import mongoose from 'mongoose';

// Define the schema
const qrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String, // to store base64 image
    required: false,
  },
  event: {
    type: String,
    required: true,
    trim: true,
  },
  issued : {
    type : Boolean,
    default : false,
  }
});

qrSchema.index({ name: 1, email: 1, event : 1 }, { unique: true });

// Create a model from the schema
const Qr = mongoose.model('Qr', qrSchema);

export default Qr;
