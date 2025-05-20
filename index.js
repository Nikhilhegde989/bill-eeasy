require('dotenv').config();

const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express()
const PORT = process.env.PORT || 3000;

const authenticateToken = require('./middleware/authMiddleware')
const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", 
    info: {
      title: "Bill Easy API",
      version: "1.0.0",
      description: "Book Review System API Documentation",
      contact: { name: "Nikhil Hegde", email: "your.email@example.com" }
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', authenticateToken, (req, res) => {
  res.send('Bill Easy API is running!');
});

app.use('/auth', authRoutes)
app.use('/books', bookRoutes)
app.use('/reviews', reviewRoutes)

app.listen(PORT, () => {
  console.log("Bill easy application is listening at port number : ", PORT)
})
