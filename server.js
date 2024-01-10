// Checks if production env is running
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');

app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); // views files
app.set('layout', 'layouts/layout'); // layout files in views/layouts folder
app.use(expressLayouts);
app.use(express.static('public')); // static files (e.g. HTML, images, etc.)

// Database Connections (MongoDB)
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL); 
const db = mongoose.connection;
// Check for Connection
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);

app.listen(process.env.PORT || 3000);
