const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /books/:id/reviews
async function addReview(req, res) {
  try {
    const userId = req.user.userId;
    const bookId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    // Input validation
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    if (!comment?.trim()) {
      return res.status(400).json({ error: 'Comment is required.' });
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // Check if the user already reviewed this book
    const existing = await prisma.review.findFirst({
      where: { bookId, userId },
    });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this book.' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        bookId,
      },
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    console.error('Add review error:', err);

    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Duplicate review not allowed.' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}


// PUT /reviews/:id
async function updateReview(req, res) {
  try {
    const userId = req.user.userId;
    const reviewId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
      }
    }
    if (comment !== undefined && !comment.trim()) {
      return res.status(400).json({ error: 'Comment cannot be empty.' });
    }

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized or review not found' });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });

    res.json({ message: 'Review updated successfully', review: updated });
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /reviews/:id
async function deleteReview(req, res) {
  try {
    const userId = req.user.userId;
    const reviewId = parseInt(req.params.id);

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized or review not found' });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  addReview,
  updateReview,
  deleteReview,
};
