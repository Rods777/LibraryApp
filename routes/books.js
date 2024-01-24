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
        res.redirect(`/books/${newBook.id}`);
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

// Show Book page
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
                                        .populate('authorName').exec(); // Populate to show author information instead of id
        res.render('books/show', { book: book } );
    } catch {
        res.redirect('/');
    }

});

// Edit Book page
router.get('/:id/edit', async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book);
    } catch {
        res.redirect('/');
    }
    
});

// Edit Book Route
router.put('/:id', async (req, res) => {
    let book;
    try{
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.authorName = req.body.authorName;
        book.publishDate = req.body.publishDate;
        book.pages = req.body.pages;
        book.description = req.body.description;

        if(req.body.cover != null && req.body.cover != ''){
            saveCover(book, req.body.cover);
        }

        await book.save();

        res.redirect(`/books/${book.id}`);

    } catch (err) {
        console.log(err)
        if(book != null){
            renderEditPage(res, book, true);
        }
        else{
            res.redirect('/')
        }
        
    }
});

router.delete('/:id', async (req, res) => {
    let book;

    try{
        book = await Book.findById(req.params.id);
        await book.deleteOne();
        res.redirect('/books');

    } catch (err) {
        if (book != null){
            res.render('/books/show', {
                book: book,
                errorMessage: "Can't Delete This Book"
            });
            console.log(err);
        } else {
            res.redirect('/');
            console.log(err);
        }
    }
});


async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'newBooks', hasError);
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false){
    try {
        const allAuthors = await Author.find({}); // Retrives all the authors
        const params = { 
            authors: allAuthors,
            book: book 
        }
        if (hasError){
            // adds a errorMessage key if error occurs
            if (form === 'edit'){
                params.errorMessage = 'Error Updating Book';
            } else {
                params.errorMessage = 'Error Creating Book';
            }
        }  
        res.render(`books/${form}`, params);
    } catch {
        res.redirect('/books');
    }
}

module.exports = router;