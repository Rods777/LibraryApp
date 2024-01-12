const mongoose = require('mongoose');

// Creating a Schema - structure of a property
const authorSchema = new mongoose.Schema({
    // Structure of a document
    name: { 
        type: String,
        required: true
    }
})

/* Defining Models - use to manipulate documents */
module.exports = mongoose.model('Author', authorSchema) // 'Author' - collection name