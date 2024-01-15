const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png']; // File types

// All Books Route
router.get('/', async (req, res) => {
    try {
        let query = Book.find();
        // search filters
        if (req.query.title != null && req.query.title != ''){
            query = query.regex('title', new RegExp(req.query.title, 'i'));
        }
        if (req.query.publishBefore != null && req.query.publishBefore != ''){
            query = query.lte('publishDate', req.query.publishBefore) // lte = less than or equal
        }
        if (req.query.publishAfter != null && req.query.publishAfter != ''){
            query = query.gte('publishDate', req.query.publishAfter) // gte = greater than or equal
        }
        const books = await query.exec();
        res.render('books/allBooks', {
            books: books,
            search: req.query
        });
    } catch{
        res.redirect('/');
    }
    
});

// New Books Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
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

    saveCover(book, req.body.cover);

    try{
        const newBook = await book.save(); // Awaits the created data to be saved
        // res.redirect(`books/${newBook.id}`);
        res.redirect(`books`);
    } catch (err) {
        console.log(err)
        renderNewPage(res, book, true);
    }
});

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    // Parsing the base64 encoded string of image into a JSON
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

async function renderNewPage(res, book, hasError = false){
    try {
        const allAuthors = await Author.find({}); // Retrives all the authors
        const params = { 
            authors: allAuthors,
            book: book 
        }
        if (hasError) params.errorMessage = 'Error Creating Book'; // adds a errorMessage key if error occurs
        res.render('books/newBooks', params);
    } catch {
        res.redirect('/books', params);
    }
}

module.exports = router;