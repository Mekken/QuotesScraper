const mongoose = require("mongoose");

let Schema = mongoose.Schema;

var CommentSchema = new Schema({
	author: {
		type: String,
		required: [true, 'Comment needs an author']
	},
	body: {
		type: String,
		default: [],
		required: [true, 'Comment needs a Body']
	}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;