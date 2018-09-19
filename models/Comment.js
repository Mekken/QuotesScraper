const mongoose = require("mongoose");

let Schema = mongoose.Schema;

var CommentSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Comment needs a Title']
	},
	body: {
		type: String,
		required: [true, 'Comment needs a Body']
	}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;