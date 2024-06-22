/**
* Module for providing database services and logic for the Task model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import Task from "../models/task.model";
// import { Document } from "mongoose";

export async function getTasks(queryObj) {
  return Task.find(queryObj);
}

export async function getTaskById(id) {
  return Task.findById(id);
}

export async function createTask(taskData) {
  const newTask = new Task(taskData);
  await newTask.save();

  return newTask;
}

export async function editTaskById(id, updateObj) {
  const existingTask = await Task.findById(id);

  if (!existingTask) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // console.log(id, updateObj); // SCAFF

  Object.entries(updateObj).forEach(([k, v]) => {
    existingTask[k] = v;
  });

  existingTask.save();

  return existingTask;
}

export async function deleteTaskById(id) {
  const existingTask = await Task.findById(id);

  if (!existingTask) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return Task.deleteOne({ _id: id });
}
