// Check for Environment
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// Modules
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
// const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');

app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); // views files
app.set('layout', 'layouts/layout'); // layout files in views/layouts folder
app.use(expressLayouts);
app.use(express.static('public')); // static files (e.g. HTML, images, etc.)
app.use(express.urlencoded({ limit: '10mb', extended: false }));


// Database Connections (MongoDB)
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL); 
const db = mongoose.connection;

// Check for Connection
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));


// Routes
app.use('/', indexRouter);
app.use('/authors', authorsRouter)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Application is listening to ${port}`);
});


// RKapKbBrm0hwpjlV mongodb pass