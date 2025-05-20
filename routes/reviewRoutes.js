const express = require('express');
const router = express.Router();
const {
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book review management
 */

/**
 * @swagger
 * /reviews/books/{id}/reviews:
 *   post:
 *     summary: Add a review for a book
 *     description: Add a new review to the book specified by ID. Authenticated users only.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "This book was really insightful."
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Validation error or review already exists
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post('/books/:id/reviews', authenticateToken, addReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update an existing review
 *     description: Update a review by ID. Only the user who created the review can update it.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Updated review comment."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the review owner)
 *       404:
 *         description: Review not found
 */
router.put('/:id', authenticateToken, updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete a review by ID. Only the user who created the review can delete it.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the review owner)
 *       404:
 *         description: Review not found
 */
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;
