require('dotenv').config();

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;


const authenticateToken = require('./middleware/authMiddleware')
const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

// Middleware to parse JSON bodies
app.use(express.json());


app.get('/',authenticateToken, (req, res) => {
  res.send('Bill Easy API is running!');
});

app.use('/auth',authRoutes)
app.use('/books',bookRoutes)
app.use('/reviews',reviewRoutes)
// app.use('/search',searchRoutes)

app.listen(PORT,()=>{
    console.log("Bill easy application is listening at port number : ",PORT)
})