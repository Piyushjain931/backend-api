const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  description: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
  age: { type: Number, required: true, min: 0, max: 150 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
