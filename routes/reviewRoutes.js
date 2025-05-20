const express = require('express');
const router = express.Router();
const {
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authMiddleware');

// Authenticated users only
router.post('/books/:id/reviews', authenticateToken, addReview);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;
