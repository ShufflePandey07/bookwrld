const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Romance', 'Mystery', 'Fantasy', 'Self-Help', 'Technology', 'Business']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  publisher: {
    type: String
  },
  publishedDate: {
    type: Date
  },
  pages: {
    type: Number
  },
  language: {
    type: String,
    default: 'English'
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=Book+Cover'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);