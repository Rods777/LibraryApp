const mongoose = require('mongoose');

// Creating a Schema/table - responsible to create and read docs
const authorSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    }
})

/* Defining Models */
module.exports = mongoose.model('Author', authorSchema) // 'Author' - table name