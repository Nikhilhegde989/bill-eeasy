const express = require('express');
const router = express.Router();

const { addBook, getBooks, getBookById } = require('../controllers/bookController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for books in the system
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     description: Add a book to the system. Requires authentication.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               genre:
 *                 type: string
 *                 example: "Classic"
 *     responses:
 *       201:
 *         description: Book created successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.post('/', authenticateToken, addBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get list of books
 *     description: Retrieve all books, supports pagination and filters.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter books by genre
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 */
router.get('/', getBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book details by ID
 *     description: Retrieve details of a book including average rating and paginated reviews.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details returned successfully
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBookById);

module.exports = router;
