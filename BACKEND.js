const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  applicationLink: { type: String, required: true },
  eligibleCourses: { type: [String], required: true },
  minGPA: { type: Number, required: true },
  eligibleLocations: { type: [String], required: true },
  specialCriteria: [String],
  source: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);