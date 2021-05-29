'use strict';
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const IssueModel = require("../models").Issue
const ProjectModel = require("../models").Project

module.exports = (app) => {

  app
    .route('/api/issues/:project')

    .get((req, res) => {
      let projectName = req.params.project;

      let {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.query

      ProjectModel.aggregate([{
          $match: {
            name: projectName
          }
        },
        {
          $unwind: "$issues"
        },
        _id != undefined ? {
          $match: {
            "issues._id": ObjectId(_id)
          }
        } : {
          $match: {}
        },
        open != undefined ? {
          $match: {
            "issues.open": open
          }
        } : {
          $match: {}
        },
        issue_title != undefined ? {
          $match: {
            "issues.issue_title": issue_title
          }
        } : {
          $match: {}
        },
        issue_text != undefined ? {
          $match: {
            "issues.issue_text": issue_text
          }
        } : {
          $match: {}
        },
        created_by != undefined ? {
          $match: {
            "issues.created_by": created_by
          }
        } : {
          $match: {}
        },
        assigned_to != undefined ? {
          $match: {
            "issues.assigned_to": assigned_to
          }
        } : {
          $match: {}
        },
        status_text != undefined ? {
          $match: {
            "issues.status_text": status_text
          }
        } : {
          $match: {}
        },
      ]).exec((err, data) => {
        if (!data) {
          res.send([])
        } else {
          let mappedData = data.map((item) => item.issues)
          res.send(mappedData)
        }
      })
    })

    .post((req, res) => {
      let project = req.params.project

      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body

      if (!issue_title || !issue_text || !created_by) {
        res.send({
          error: 'required field(s) missing'
        })
        return
      }

      let newIssue = new IssueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || ""
      })

      ProjectModel.findOne({
        name: project
      }, (err, docs) => {
        if (!docs) {
          let newDocs = new ProjectModel({
            name: project
          });
          newDocs.issues.push(newIssue);
          newDocs.save((err, data) => {
            if (err || !data) {
              res.send("Error")
            } else {
              res.json(newIssue)
            }
          });
        } else {
          docs.issues.push(newIssue);
          docs.save((err, data) => {
            if (err || !data) {
              res.send("Error")
            } else {
              res.json(newIssue)
            }
          })
        }
      })
    })

    .put((req, res) => {
      let project = req.params.project;

      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body

      if (!_id) {
        //console.log(!_id)
        return res.json({
          error: "missing _id"
        })
      }

      if (
        !issue_title && !issue_text && !created_by &&
        !assigned_to && !status_text && open == null
      ) {
        // console.log(
        //   !issue_title && !issue_text && !created_by &&
        //   !assigned_to && !status_text && open == null)
        return res.json({
          error: "no update field(s) sent",
          _id: _id
        })
      }

      ProjectModel.findOne({
        name: project
      }, (err, docs) => {
        if (err || !docs) {
          res.json({
            error: 'could not update',
            _id: _id
          })
        } else {
          const updatedIssue = docs.issues.id(_id)
          if (!updatedIssue) {
            res.json({
              error: 'could not update',
              _id: _id
            })
            return
          }
          updatedIssue.issue_title = issue_title || updatedIssue.issue_title
          updatedIssue.issue_text = issue_text || updatedIssue.issue_text
          updatedIssue.created_by = created_by || updatedIssue.created_by
          updatedIssue.assigned_to = assigned_to || updatedIssue.assigned_to
          updatedIssue.status_text = status_text || updatedIssue.status_text
          updatedIssue.updated_on = new Date()
          updatedIssue.open = open
          docs.save((err, data) => {
            if (err || !data) {
              res.json({
                error: 'could not update',
                _id: _id
              })
            } else {
              res.json({
                result: 'successfully updated',
                _id: _id
              })
            }
          })
        }
      })
    })

    .delete((req, res) => {
      let project = req.params.project;

      const {
        _id
      } = req.body;

      if (!_id) {
        //console.log(!_id)
        return res.json({
          error: "missing _id"
        })
      }

      ProjectModel.findOne({
        name: project
      }, (err, docs) => {
        if (!docs || err) {
          res.json({
            error: 'could not delete',
            _id: _id
          })
        } else {
          const deletedDocs = docs.issues.id(_id)
          if (!deletedDocs) {
            res.json({
              error: 'could not delete',
              _id: _id
            })
            return
          }
          deletedDocs.remove()

          docs.save((err, data) => {
            if (err || !data) {
              res.json({
                error: 'could not delete',
                _id: _id
              })
            } else {
              res.json({
                result: 'successfully deleted',
                _id: _id
              })
            }
          })
        }
      })
    })
}