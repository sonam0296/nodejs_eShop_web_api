const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    icon: {
        type: String,
    },
    image: {
        type: String,
        default: ''
    },
})

exports.Category = mongoose.model('Category', categorySchema)