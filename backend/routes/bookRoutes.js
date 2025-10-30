const express = require('express');
const router = express.Router();
const {
  getBooks,
  getFeaturedBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/categories/all', getCategories);
router.get('/:id', getBookById);

// Admin routes
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;