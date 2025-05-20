const express = require('express');
const router = express.Router();

const { addBook, getBooks, getBookById } = require('../controllers/bookController');
const authenticateToken = require('../middleware/authMiddleware'); // Assuming your middleware is here

// POST /books – Add a new book (Authenticated users only)
router.post('/', authenticateToken, addBook);

// GET /books – Get all books (with pagination and optional filters)
router.get('/', getBooks);

// GET /books/:id – Get book details by ID (average rating + paginated reviews)
router.get('/:id', getBookById);

module.exports = router;
