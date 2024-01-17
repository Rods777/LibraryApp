const mongoose = require('mongoose');
const Book = require('./book');

// Creating a Schema - structure of a property
const authorSchema = new mongoose.Schema({
    // Structure of a document
    name: { 
        type: String,
        required: true
    }
});

// Check if the author has a book before removing
authorSchema.pre('deleteOne', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if(err){
            next(err);
        } else if (books.length > 0) {
            next(new Error('This author has book still!'));
        } else {
            next()
        }
    })
})

/* Defining Models - use to manipulate documents */
module.exports = mongoose.model('Author', authorSchema) // 'Author' - collection name