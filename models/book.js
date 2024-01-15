const mongoose = require('mongoose');
// Schema
const bookSchema = new mongoose.Schema({
    // Structures of a document
    title: {
        type: String,
        required: true
    },
    authorName:{
        type: mongoose.Schema.Types.ObjectId, // id of Author
        required: true,
        ref: 'Author' // referencing to Authors collection
    },
    publishDate: {
        type: Date,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
});

/* Defining Models */
module.exports = mongoose.model('Book', bookSchema);