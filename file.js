const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    originalName: String,
    uploadedBy: String,
    path: String,
    size: Number,
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema);
