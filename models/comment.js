const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
	text   : String,
	author : String
});

module.exports = mongoose.model('Comment', campgroundSchema);
