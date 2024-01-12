const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

// All Books Route
router.get('/', (req, res) => {
    res.render('books/allBooks');
});

// New Books Route
router.get('/new', async (req, res) => {
    try {
        const allAuthors = await Author.find({}); // Retrives all the authors
        const book = new Book();
        res.render('books/newBooks', { 
            authors: allAuthors,
            book: book 
        });
    } catch {
        res.redirect('/books')
    }
    
});

// Create Books Route
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        authorName: req.body.authorName,
        publishDate: new Date(req.body.publishDate),
        pages: req.body.pages,
        description: req.body.description
    });

    try{
        const newBook = await book.save();
        res.redirect('books');
    } catch {
        res.render('books/newBooks', {
            
        })
    }
});

module.exports = router;