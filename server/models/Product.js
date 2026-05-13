const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  fakeStoreId: {
    type: Number,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['electronics', 'clothing', 'home', 'sports', 'books', 'other']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);