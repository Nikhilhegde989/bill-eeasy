# 📚 Book Review System

A backend system for managing book reviews. Built with **Node.js**, **Express.js**, **Prisma ORM**, and **SQLite**, this project demonstrates secure authentication with **JWT**, relational modeling with **Prisma**, and robust review management with proper authorization controls.

---

## ✨ Features

* ✅ User registration and secure login (hashed passwords, JWT)
* ✅ Submit reviews (1 review per user per book)
* ✅ Edit/delete your own reviews
* ✅ Input validation and error handling
* ✅ SQLite database managed via Prisma ORM
* ✅ Indexed database for performance
* ✅ RESTful API structure with modular code organization

---

## 🪰 Tech Stack

| Layer       | Technology         |
| ----------- | ------------------ |
| Runtime     | Node.js (v14+)     |
| Framework   | Express.js         |
| ORM         | Prisma             |
| Database    | SQLite             |
| Auth        | JWT                |
| Validation  | Express Middleware |
| Environment | dotenv             |

---

## 🛠️ Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nikhilhegde989/bill-eeasy.git
cd bill-eeasy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file:

```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="billeasy"
NODE_ENV=dev
```

### 4. Initialize database

```bash
npx prisma db push
# OR, if using migrations
npx prisma migrate dev --name init
```

### 5. Start the server

```bash
npm start
```

Runs at: `http://localhost:3001`

---

## 📬 API Endpoints Overview

### 📌 Authentication

* `POST /auth/register` – Register user
* `POST /auth/login` – Login and receive JWT

### 📌 Books

* `GET /books` – Get all books
* `POST /books` – Add new book

### 📌 Reviews

* `POST /books/:id/reviews` – Add a review (authenticated)
* `PUT /reviews/:id` – Edit your review (authenticated)
* `DELETE /reviews/:id` – Delete your review (authenticated)

All review routes are protected and validate user authorization.

---

## 🎯 Design Decisions & Assumptions

* **Authorization**: Only the user who created a review can modify or delete it.
* **Unique Constraints**: A user can only post one review per book.
* **Indexes**: Added on `title`, `genre`, `userId`, `bookId`, and `email` for better query performance.
* **Security**:

  * Passwords are hashed before storing.
  * JWT tokens securely encode user identity.
  * Environment variables are used for secrets.
* **ORM Choice**: Prisma simplifies data modeling, migration, and querying.

---
📜 Swagger API Documentation
API documentation is available and auto-generated using Swagger UI.

After starting the server, open your browser and visit:
[text](http://localhost:3001/api-docs)


## 🧪 Sample Workflow

1. Register a new user
2. Login to get a JWT token
3. Use the token to:

   * Get book list
   * Submit a review
   * Update or delete your review


---

## 📂 Project Structure

```
📆 book-review-system
├── prisma/              # Prisma schema and migration files
├── controllers/         # Route handler logic
├── routes/              # Express route definitions
├── middleware/          # JWT and validation middlewares
├── .env                 # Environment config
├── package.json         # Dependencies and scripts
├── README.md            # Project documentation
```

🗄️ How to View the Database
Since this project uses SQLite, you can inspect and manage the database with the following method:
Prisma Studio
run the command -> npx prisma studio

Opens at: http://localhost:5555 in the browser.

Browse, and inspect database content easily.

---

## 📊 Future Improvements

* Role-based access (admin features)
* Review timestamps and sorting
* Pagination and filtering
* Unit & integration tests using Jest or Mocha
* Docker support

---

## 👨‍💼 About Me

I’m a passionate software engineer focused on backend development and scalable systems. This project demonstrates my understanding of authentication, database design, API development, and production-level coding practices.

Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/nikhilhegde989/) or reach out via email.

---


