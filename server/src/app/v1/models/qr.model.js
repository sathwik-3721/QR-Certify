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
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String, // Use Buffer to store binary data like a Blob
    required: false,
  },
  event: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create a model from the schema
const Qr = mongoose.model('Qr', qrSchema);

export default Qr;