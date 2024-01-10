const mongoose = require('mongoose');

// Creating a Schema/table
const authorSchema = new mongoose.Schema({
    name: { // name Column
        type: String,
        required: true
    }
})

/* Defining Models */
module.exports = mongoose.model('Author', authorSchema) // 'Author' - table name