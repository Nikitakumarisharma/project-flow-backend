const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  //
  content: {
    type: String,
    // required: true,
    default: null,
  },
  author: {
    type: String,
    // required: true
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  clientPhone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    // required: true,
    enum: [
      "requirements",
      "development",
      "payment",
      "credentials",
      "completed",
    ],
    default: "requirements",
  },
  approved: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: String,
    default: null,
  },
  deadline: {
    type: Date,
    default: null,
  },
  completionDate: {
    type: Date,
    default: null,
  },
  renewalDate: {
    type: Date,
    default: null,
  },
  referenceId: {
    type: String,
    unique: true,
  },
  createdBy: {
    type: String,
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: [noteSchema],
    default: [],
  },
});

const post = mongoose.model("Post", postSchema);

module.exports = { post };
