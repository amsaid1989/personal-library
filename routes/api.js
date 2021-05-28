/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const { response } = require("express");
const dbOp = require("../api/dbOp");

module.exports = function (app) {
    app.route("/api/books")
        .get(function (req, res) {
            dbOp.getAllBooks()
                .then((books) => {
                    res.json(books);
                })
                .catch((err) => {
                    res.json({ error: err });
                });
        })

        .post(function (req, res) {
            const title = req.body.title;
            console.log("TITLE:", title);

            if (!title) {
                res.send("missing required field title");
            } else {
                dbOp.addBook(title)
                    .then((book) => {
                        res.json({
                            _id: book._id,
                            title: book.title,
                        });
                    })
                    .catch((err) => {
                        res.json({ error: err });
                    });
            }
        })

        .delete(function (req, res) {
            dbOp.removeAllBooks()
                .then((response) => {
                    res.send("complete delete successful");
                })
                .catch((err) => {
                    res.json({ error: err });
                });
        });

    app.route("/api/books/:id")
        .get(function (req, res) {
            const bookid = req.params.id;

            dbOp.getBook(bookid)
                .then((book) => {
                    if (!book) {
                        res.send("no book exists");
                    } else {
                        res.json(book);
                    }
                })
                .catch((err) => {
                    res.json({ error: err });
                });
        })

        .post(function (req, res) {
            const bookid = req.params.id;
            const comment = req.body.comment;

            console.log("ID:", bookid);
            console.log("COMMENT:", comment);

            if (!comment) {
                res.send("missing required field comment");
            } else {
                dbOp.addComment(bookid, comment)
                    .then((book) => {
                        if (!book) {
                            res.send("no book exists");
                        } else {
                            res.json(book);
                        }
                    })
                    .catch((err) => {
                        res.json({ error: err });
                    });
            }
        })

        .delete(function (req, res) {
            const bookid = req.params.id;

            dbOp.removeBook(bookid).then((response) => {
                if (response.deletedCount === 0) {
                    res.send("no book exists");
                } else {
                    res.send("delete successful");
                }
            });
        });
};
