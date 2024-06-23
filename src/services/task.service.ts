/**
* Module for providing database services and logic for the Task model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import { TaskCreateDTO, TaskDoc, TaskQueryDTO, TaskUpdateDTO } from "@/types";
import Task from "../models/task.model";
import { Types } from "mongoose";
import { ApiError } from "@/lib/error-handling";
import { updateTask } from "@/lib/utils";
// import { Document } from "mongoose";

export async function getTasks(queryObj: TaskQueryDTO) {
  return Task.find(queryObj);
}

export async function getTaskById(id: Types.ObjectId) {
  return Task.findById(id);
}

export async function createTask(taskData: TaskCreateDTO) {
  const newTask = new Task(taskData);
  await newTask.save();

  return newTask;
}

export async function editTaskById(
  existingTask: TaskDoc,
  updateObj: TaskUpdateDTO
) {
  const updatedTask = updateTask(existingTask, updateObj);

  // console.log(id, updateObj); // SCAFF

  updatedTask.save();

  return updatedTask;
}

export async function deleteTaskById(id: Types.ObjectId) {
  return Task.deleteOne({ _id: id });
}
