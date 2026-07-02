const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  originalPrice: {
    type: Number
  },
  tag: {
    type: String,
    default: 'featured'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
