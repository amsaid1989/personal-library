/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const mongoose = require("mongoose");
const server = require("../server");
const dbOp = require("../api/dbOp");

chai.use(chaiHttp);

suite("Functional Tests", function () {
    // suiteSetup(function (done) {
    //     mongoose
    //         .connect(process.env.DB, {
    //             useNewUrlParser: true,
    //             useUnifiedTopology: true,
    //             useCreateIndex: true,
    //         })
    //         .then(() => {
    //             done();
    //         });
    // });
    /*
     * ----[EXAMPLE TEST]----
     * Each test should completely test the response of the API end-point including response status code!
     */
    // test("#example Test GET /api/books", function (done) {
    //     chai.request(server)
    //         .get("/api/books")
    //         .end(function (err, res) {
    //             assert.equal(res.status, 200);
    //             assert.isArray(res.body, "response should be an array");
    //             assert.property(
    //                 res.body[0],
    //                 "commentcount",
    //                 "Books in array should contain commentcount"
    //             );
    //             assert.property(
    //                 res.body[0],
    //                 "title",
    //                 "Books in array should contain title"
    //             );
    //             assert.property(
    //                 res.body[0],
    //                 "_id",
    //                 "Books in array should contain _id"
    //             );
    //             done();
    //         });
    // });
    /*
     * ----[END of EXAMPLE TEST]----
     */

    suite("Routing tests", function () {
        suite(
            "POST /api/books with title => create book object/expect book object",
            function () {
                test("Test POST /api/books with title", function (done) {
                    const body = { title: "Children of the Alley" };

                    chai.request(server)
                        .post("/api/books")
                        .send(body)
                        .then((res) => {
                            assert.ok(res);
                            assert.equal(res.status, 200);
                            assert.isNotEmpty(res.body);
                            assert.containsAllKeys(res.body, ["_id", "title"]);
                            assert.equal(res.body.title, body.title);

                            done();
                        })
                        .catch((err) => {
                            console.error(err);

                            assert.fail();

                            done(err);
                        });
                });

                test("Test POST /api/books with no title given", function (done) {
                    chai.request(server)
                        .post("/api/books")
                        .send({ title: "" })
                        .then((res) => {
                            assert.ok(res);
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.text,
                                "missing required field title"
                            );

                            done();
                        })
                        .catch((err) => {
                            console.error(err);

                            assert.fail();

                            done(err);
                        });
                });
            }
        );

        suite("GET /api/books => array of books", function () {
            suiteSetup(function (done) {
                mongoose.connection.dropCollection("books").then(() => {
                    dbOp.addBook("Children of the Alley").then((b1) => {
                        dbOp.addBook("Programming for Dummies").then((b2) => {
                            dbOp.addBook(
                                "Mathematics for Computer Graphics"
                            ).then((b3) => {
                                done();
                            });
                        });
                    });
                });
            });

            test("Test GET /api/books", function (done) {
                chai.request(server)
                    .get("/api/books")
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        assert.lengthOf(res.body, 3);
                        assert.containsAllKeys(res.body[0], [
                            "title",
                            "commentcount",
                            "comments",
                        ]);

                        done();
                    })
                    .catch((err) => {
                        console.error(err);

                        assert.fail();

                        done(err);
                    });
            });
        });

        suite("GET /api/books/[id] => book object with [id]", function () {
            test("Test GET /api/books/[id] with id not in db", function (done) {
                const id = "123456789098765432101234";
                chai.request(server)
                    .get(`/api/books/${id}`)
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");

                        done();
                    })
                    .catch((err) => {
                        console.error(err);

                        assert.fail();

                        done(err);
                    });
            });

            test("Test GET /api/books/[id] with valid id in db", function (done) {
                const request = chai.request(server).keepOpen();

                const book = { title: "My test book" };
                request
                    .post("/api/books")
                    .send(book)
                    .then((res) => {
                        const id = res.body._id;

                        request
                            .get(`/api/books/${id}`)
                            .then((res) => {
                                request.close();

                                assert.ok(res);
                                assert.equal(res.status, 200);
                                assert.isNotEmpty(res.body);
                                assert.containsAllKeys(res.body, [
                                    "title",
                                    "commentcount",
                                    "comments",
                                ]);
                                assert.equal(res.body._id, id);
                                assert.equal(res.body.title, book.title);

                                done();
                            })
                            .catch((err) => {
                                console.error(err);

                                assert.fail();

                                done(err);
                            });
                    });
            });
        });

        suite(
            "POST /api/books/[id] => add comment/expect book object with id",
            function () {
                test("Test POST /api/books/[id] with comment", function (done) {
                    const request = chai.request(server).keepOpen();

                    const book = { title: "Hello World" };

                    request
                        .post("/api/books")
                        .send(book)
                        .then((res) => {
                            const id = res.body._id;

                            request
                                .post(`/api/books/${id}`)
                                .send({ comment: "My first comment" })
                                .then((res) => {
                                    request.close();

                                    assert.ok(res);
                                    assert.equal(res.status, 200);
                                    assert.isNotEmpty(res.body);
                                    assert.isArray(res.body.comments);
                                    assert.lengthOf(res.body.comments, 1);
                                    assert.equal(res.body.commentcount, 1);
                                    assert.equal(res.body.title, book.title);

                                    done();
                                });
                        })
                        .catch((err) => {
                            console.error(err);

                            assert.fail();

                            done(err);
                        });
                });

                test("Test POST /api/books/[id] without comment field", function (done) {
                    const id = "123456789098765432101234";

                    chai.request(server)
                        .post(`/api/books/${id}`)
                        .send({ comment: "" })
                        .then((res) => {
                            assert.ok(res);
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.text,
                                "missing required field comment"
                            );

                            done();
                        })
                        .catch((err) => {
                            console.error(err);

                            assert.fail();

                            done(err);
                        });
                });

                test("Test POST /api/books/[id] with comment, id not in db", function (done) {
                    const id = "123456789098765432101234";

                    chai.request(server)
                        .post(`/api/books/${id}`)
                        .send({ comment: "My first comment" })
                        .then((res) => {
                            assert.ok(res);
                            assert.equal(res.status, 200);
                            assert.equal(res.text, "no book exists");

                            done();
                        })
                        .catch((err) => {
                            console.error(err);

                            assert.fail();

                            done(err);
                        });
                });
            }
        );

        suite("DELETE /api/books/[id] => delete book object id", function () {
            test("Test DELETE /api/books/[id] with valid id in db", function (done) {
                const request = chai.request(server).keepOpen();

                request
                    .post("/api/books")
                    .send({ title: "My new book" })
                    .then((res) => {
                        const id = res.body._id;

                        request.delete(`/api/books/${id}`).then((res) => {
                            request.close();

                            assert.ok(res);
                            assert.equal(res.status, 200);
                            assert.equal(res.text, "delete successful");

                            done();
                        });
                    })
                    .catch((err) => {
                        console.error(err);

                        assert.fail();

                        done(err);
                    });

                chai.request(server);
            });

            test("Test DELETE /api/books/[id] with  id not in db", function (done) {
                const id = "123456789098765432101234";

                chai.request(server)
                    .delete(`/api/books/${id}`)
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");

                        done();
                    })
                    .catch((err) => {
                        console.error(err);

                        assert.fail();

                        done(err);
                    });
            });
        });
    });
});
