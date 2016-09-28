'use strict';

const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const Job = new Schema({
  company: String,
  type: [String],
  field: [String],
  stack: [String],
  where: [String],
  links: [String],
  locs: [String],
  by: String,
  active: Boolean,
  onstory: String,
  html: String,
  hn_id: { type: String, required: true, unique: true },
  created_at: Date,
  updated_at: Date
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

Job.index({ hn_id: 1 });
Job.plugin(uniqueValidator);

export default mongoose.model('Job', Job);
