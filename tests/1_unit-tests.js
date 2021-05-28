const chai = require("chai");
const assert = chai.assert;
const dbOp = require("../api/dbOp");

suite("Unit Tests", function () {
    suite("addComment", function () {
        test("should add comment to book and increment the commentcount", function (done) {
            dbOp.addBook("Children of the Alley")
                .then((book) => {
                    const id = book._id;

                    dbOp.addComment(id, "This is my comment").then(() => {
                        dbOp.addComment(id, "My second comment").then((doc) => {
                            assert.isNotEmpty(doc);
                            assert.equal(doc.title, "Children of the Alley");
                            assert.isArray(doc.comments);
                            assert.lengthOf(doc.comments, 2);
                            assert.equal(doc.commentcount, 2);

                            done();
                        });
                    });
                })
                .catch((err) => {
                    console.error(err);

                    assert.fail();

                    done(err);
                });
        });

        test("should return null if provided id is not found", function (done) {
            dbOp.addComment("123456789098765432101234", "My comment")
                .then((doc) => {
                    assert.isNull(doc);

                    done();
                })
                .catch((err) => {
                    console.error(err);

                    assert.fail();

                    done(err);
                });
        });

        test("should return null if provided id is invalid", function (done) {
            dbOp.addComment("", "My comment")
                .then((doc) => {
                    assert.isNull(doc);

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
