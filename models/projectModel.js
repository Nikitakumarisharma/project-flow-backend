const mongoose = require("mongoose");

// Define the Note schema
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    default: null,
  },
  author: {
    type: String,
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

// Define the Credential schema
const credentialSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

// Define the Project schema
const projectSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User',
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  credentials: {
    type: [credentialSchema],
    default: [],
  },
  notes: {
    type: [noteSchema],
    default: [],
  },
});

// Create a model from the schema
const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
