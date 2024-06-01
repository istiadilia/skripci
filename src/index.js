const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./endpoint/auth/routes');
const postRoutes = require('./endpoint/post/routes');

// let node.js process to read .env file
dotenv.config();

const app = express();

// middleware untuk parsing JSON
app.use(bodyParser.json())
// middleware untuk parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes)
app.use('/post', postRoutes)

// route
// app.use()
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});