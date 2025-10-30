const Book = require('../models/Book');

// @desc    Get all books with search and filter
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    let query = {};

    // Search by title or author
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(query)
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 });

    const count = await Book.countDocuments(query);

    res.json({
      books,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ featured: true }).limit(6);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      category,
      isbn,
      publisher,
      publishedDate,
      pages,
      language,
      imageUrl,
      stock,
      featured
    } = req.body;

    const book = new Book({
      title,
      author,
      description,
      price,
      category,
      isbn,
      publisher,
      publishedDate,
      pages,
      language,
      imageUrl,
      stock,
      featured
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.description = req.body.description || book.description;
      book.price = req.body.price !== undefined ? req.body.price : book.price;
      book.category = req.body.category || book.category;
      book.isbn = req.body.isbn || book.isbn;
      book.publisher = req.body.publisher || book.publisher;
      book.publishedDate = req.body.publishedDate || book.publishedDate;
      book.pages = req.body.pages || book.pages;
      book.language = req.body.language || book.language;
      book.imageUrl = req.body.imageUrl || book.imageUrl;
      book.stock = req.body.stock !== undefined ? req.body.stock : book.stock;
      book.featured = req.body.featured !== undefined ? req.body.featured : book.featured;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await book.deleteOne();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/books/categories/all
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getFeaturedBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories
};