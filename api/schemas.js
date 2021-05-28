const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    commentcount: { type: Number },
    comments: { type: Array },
});

module.exports = {
    bookSchema,
};
