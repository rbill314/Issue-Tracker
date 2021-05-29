const mongoose = require("mongoose")

const IssueSchema = new mongoose.Schema({
    issue_title: {
        type: String,
        require: true
    },
    issue_text: {
        type: String,
        require: true
    },
    created_on: Date,
    updated_on: Date,
    created_by: {
        type: String,
        require: true
    },
    assigned_to: {
        type: String
    },
    open: Boolean,
    status_text: {
        type: String
    }
})

const Issue = mongoose.model("Issues", IssueSchema)

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    issues: [
        IssueSchema
    ]
})

const Project = mongoose.model("Project", ProjectSchema)

exports.Issue = Issue
exports.Project = Project