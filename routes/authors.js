const express = require('express');
const router = express.Router();

// Models
const Author = require('../models/author');
const Book = require('../models/book');

// All Author Route
router.get('/', async (req, res) =>{
    let search = {};
    if (req.query.authorName != null && req.query.authorName != ''){
        search.name = new RegExp(req.query.authorName, 'i');
    }
    // Error Handlers
    try {
        const allAuthors = await Author.find(search); // Retrives all the Authors Data
        res.render('authors/index', { 
            authors: allAuthors,
            search: req.query 
        });
    } catch {
        res.redirect('/');
    }
});

// New Author Route
router.get('/new', (req, res) =>{
    res.render('authors/new', { author: new Author()});
});

// Create Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.authorsName // Inputted value in HTML input
    });

    // Error Handlers
    try {
        const newAuthor = await author.save(); // Awaits the created data to be saved
        res.redirect(`authors/${newAuthor.id}`);
    } catch { 
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        });
    }
});

// View Author Page
router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ authorName: author.id }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });
    } catch {
        res.redirect('/');
    }
});

// Edit Author Page
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author});
    } catch {
        res.redirect('authors/');
    }
    
})

// Edit Author
router.put('/:id', async (req, res) => {
    let author

    // Error Handlers
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.authorsName;
        await author.save(); // Awaits the updated data to be saved
        res.redirect(`/authors/${author.id}`);
    } catch {
        if (author == null){
            res.redirect(`/`);
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error Editing Author'
            });
        }
    }
});

// Delete Author
router.delete('/:id', async (req, res) => {
    let author
    // Error Handlers
    try {
        author = await Author.findById(req.params.id)
        await author.deleteOne(); // Awaits data to be remove/deleted
        res.redirect('/authors');
    } catch (err) {
        if (author == null){
            res.redirect('/');
            console.log(err);
        } else {
            res.redirect(`/authors/${author.id}`);
            console.log(err);
        }
    }
})

module.exports = router;