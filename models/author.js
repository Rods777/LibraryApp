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
authorSchema.pre("deleteOne", async function (next) {
    try {
        const query = this.getFilter();
        const hasBook = await Book.exists({ author: query._id });
  
        if (hasBook) {
            next(new Error("This author still has books."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

/* Defining Models - use to manipulate documents */
module.exports = mongoose.model('Author', authorSchema) // 'Author' - collection name