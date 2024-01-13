const express = require('express');
const router = express.Router();
const Author = require('../models/author'); // Models

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
        // res.redirect(`authors/${newAuthor.id}`);
        res.redirect(`authors`);
    } catch { 
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        });
    }
})

module.exports = router;