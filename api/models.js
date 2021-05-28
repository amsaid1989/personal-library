const mongoose = require("mongoose");
const { bookSchema } = require("./schemas");

const Book = mongoose.model("Book", bookSchema);

module.exports = {
    Book,
};
