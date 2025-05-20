const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /books
async function addBook(req, res) {
  try {
    const { title, author, genre } = req.body;

    if (!title || !author || !genre) {
      return res.status(400).json({ error: 'Title, author, and genre are required' });
    }

    const newBook = await prisma.book.create({
      data: { title, author, genre },
    });

    res.status(201).json({
    message: "New Book Added Successfully",
    data: newBook
    });
  } catch (err) {
    console.error('Eror while adding a book:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /books
async function getBooks(req, res) {
  try {
    const { title = '', author = '', genre = '', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    //sqlite by default doesnot support case insensitive search thats why using raw query
    const books = await prisma.$queryRaw`
      SELECT * FROM Book
      WHERE LOWER(title) LIKE '%' || LOWER(${title.trim()}) || '%'
      AND LOWER(author) LIKE '%' || LOWER(${author.trim()}) || '%'
      AND LOWER(genre) LIKE '%' || LOWER(${genre.trim()}) || '%'
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(skip)}
    `;

    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found matching the criteria.' });
    }

    res.json(books);
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// GET /books/:id
async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          skip,
          take: limit,
          select: {
            id: true,
            rating: true,
            comment: true,
            user: {
              select: { email: true }
            }
          }
        }
      }
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Calculate average rating
    const ratings = await prisma.review.findMany({
      where: { bookId: parseInt(id) },
      select: { rating: true },
    });

    const averageRating = ratings.length
      ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
      : null;

    res.json({ ...book, averageRating });
  } catch (err) {
    console.error('Get book by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  addBook,
  getBooks,
  getBookById,
};
