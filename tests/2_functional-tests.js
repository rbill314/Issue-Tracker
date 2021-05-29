const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

var _idNum
var _idNum2

// 1.  Create an issue with every field: POST request to /api/issues/{project}
// 2.  Create an issue with only required fields: POST request to /api/issues/{project}
// 3.  Create an issue with missing required fields: POST request to /api/issues/{project}
//---------------------------------------------------------------------------------------------
// 4.  View issues on a project: GET request to /api/issues/{project}
// 5.  View issues on a project with one filter: GET request to /api/issues/{project}
// 6.  View issues on a project with multiple filters: GET request to /api/issues/{project}
//---------------------------------------------------------------------------------------------
// 7.  Update one field on an issue: PUT request to /api/issues/{project}
// 8.  Update multiple fields on an issue: PUT request to /api/issues/{project}
// 9.  Update an issue with missing _id: PUT request to /api/issues/{project}
// 10. Update an issue with no fields to update: PUT request to /api/issues/{project}
// 11. Update an issue with an invalid _id: PUT request to /api/issues/{project}
//---------------------------------------------------------------------------------------------
// 12. Delete an issue: DELETE request to /api/issues/{project}
// 13. Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// 14. Delete an issue with missing _id: DELETE request to /api/issues/{project}
//---------------------------------------------------------------------------------------------

suite('Functional Tests', () => {
  suite("POST /api/issues/{project} => object with issue data", () => {
    test("1 Every field filled in", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title")
          assert.equal(res.body.issue_text, "text")
          assert.equal(res.body.created_by, "Every field filled in")
          assert.equal(res.body.assigned_to, "Chai and Mocha")
          assert.equal(res.body.status_text, "In QA")
          _idNum = res.body._id;
          done();
        });
    });

    test("2 Required fields filled in", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Every field filled in"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title")
          assert.equal(res.body.issue_text, "text")
          assert.equal(res.body.created_by, "Every field filled in")
          done()
        })
    })

    test("3 Missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Every field filled in"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title")
          assert.equal(res.body.issue_text, "text")
          assert.equal(res.body.created_by, "Every field filled in")
          done()
        })
    })

    suite(
      "GET /api/issues/{project} => Array of objects with issue data",
      () => {
        test("4 No filter", (done) => {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              assert.property(res.body[0], 'issue_title')
              assert.property(res.body[0], 'issue_text')
              assert.property(res.body[0], 'created_on')
              assert.property(res.body[0], 'updated_on')
              assert.property(res.body[0], 'created_by')
              assert.property(res.body[0], 'assigned_to')
              assert.property(res.body[0], 'open')
              assert.property(res.body[0], 'status_text')
              assert.property(res.body[0], '_id')
              done()
            })
        })

        test("5 One filter", (done) => {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({
              issue_title: "Title"
            })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              assert.property(res.body[0], 'issue_title')
              assert.property(res.body[0], 'issue_text')
              assert.property(res.body[0], 'created_on')
              assert.property(res.body[0], 'updated_on')
              assert.property(res.body[0], 'created_by')
              assert.property(res.body[0], 'assigned_to')
              assert.property(res.body[0], 'open')
              assert.property(res.body[0], 'status_text')
              assert.property(res.body[0], '_id')
              done()
            })
        })


        test("6 Multiple filters", (done) => {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({
              issue_title: "Title",
              issue_text: "text",
            })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              assert.property(res.body[0], 'issue_title')
              assert.property(res.body[0], 'issue_text')
              assert.property(res.body[0], 'created_on')
              assert.property(res.body[0], 'updated_on')
              assert.property(res.body[0], 'created_by')
              assert.property(res.body[0], 'assigned_to')
              assert.property(res.body[0], 'open')
              assert.property(res.body[0], 'status_text')
              assert.property(res.body[0], '_id')
              done()
            })
        })
      })

    suite("PUT /api/issues/{project} => text", () => {

      test("7 missing _id", (done) => {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            issue_title: "Title"
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, '{"error":"missing _id"}')
            done()
          })
      })

      test("8 One field to update", (done) => {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            issue_title: "Title",
            _id: _idNum
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              result: "successfully updated",
              _id: _idNum
            });
            done()
          })
      })

      test("9 Multiple fields to update", (done) => {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            issue_title: "Title",
            open: false,
            _id: _idNum
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              result: "successfully updated",
              _id: _idNum
            });
            done()
          })
      })

      test("10 no fields to update", (done) => {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: "606d9298a76c980d6660a24c"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              error: "no update field(s) sent",
              _id: "606d9298a76c980d6660a24c"
            })
            done()
          })
      })

      test("11 invalid _id", (done) => {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            issue_title: "This title should never exist",
            _id: "606d928da76c980d6660a24b"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              error: "could not update",
              _id: "606d928da76c980d6660a24b"
            })
            done()
          })
      })
    })

    suite("DELETE /api/issues/{project} => text", () => {
      test("12 No _id", (done) => {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, '{"error":"missing _id"}')
            done()
          })
      })

      test("13 Valid _id", (done) => {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({
            _id: _idNum
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              result: "successfully deleted",
              _id: _idNum
            })
            done()
          })
      })

      test("14 wrong _id", (done) => {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({
            _id: _idNum2
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, '{"error":"missing _id"}')
            done()
          })
      })
    })
  })
})