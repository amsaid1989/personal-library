require("dotenv").config();
const mongoose = require("mongoose");
const { Book } = require("./models");

module.exports = {
    addBook: function (title) {
        const doc = new Book({ title, commentcount: 0 });

        return doc.save();
    },

    getBook: function (id) {
        return Book.findById(id).exec();
    },

    getAllBooks: function () {
        return Book.find({}).exec();
    },

    removeBook: function (id) {
        return Book.deleteOne({ _id: id });
    },

    removeAllBooks: function () {
        return Book.deleteMany({});
    },

    addComment: function (id, comment) {
        return new Promise((resolve, reject) => {
            if (!id) {
                resolve(null);
            } else {
                this.getBook(id)
                    .then((book) => {
                        if (book) {
                            book.comments.push(comment);

                            book.commentcount = book.comments.length;

                            resolve(book.save());
                        } else {
                            resolve(null);
                        }
                    })
                    .catch(() => {
                        resolve(null);
                    });
            }
        });
    },
};
