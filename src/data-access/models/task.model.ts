/**
* Model for mapping to database.
* - Framework-specific to Mongoosejs
* - Database-specific to MongoDB
*/

import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
});

const Task = model('Task', TaskSchema);

export default Task;
