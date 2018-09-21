const mongoose = require("mongoose");

let Schema  = mongoose.Schema;

var QuoteSchema = new Schema({
	author: {
		type: String,
		required: [true, 'Object must have an author to save']
	},
	body: {
		type: String,
		required: [true, 'Object must have text to save']
	},
	tags: {
		type: Array,
		default: []
	},
	comments: [ {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	} ]
});

var Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;