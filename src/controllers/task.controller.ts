/**
* Formats use-case input and output.
* - ensures input data is in the form the
*   application-specific business rules/logic want it.
* - will pass dependencies to be injected to use cases,
*   thus knowing about and depending on their import.
*/

import {Request, Response, NextFunction} from "express";

import * as taskServices from "@/src/services/task.service";
import eventEmitter from "../events/api-events";
import {
  AuthenticatedRequest,
  TaskCreateDTO,
  TaskDoc,
  TaskQueryDTO,
  TaskUpdateDTO,
} from "@/types";
import {
  getTaskDataFrom,
  getTaskQueryFrom,
  getTaskUpdateFrom,
} from "@/lib/utils";
import { Types } from "mongoose";

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - data validation
// - data formatting
// - custom error handler

export async function getTasks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const queryObj: TaskQueryDTO = getTaskQueryFrom(req.query);

  try {
    const tasks = await taskServices.getTasks(
      queryObj,
      req.user.reqUserId && new Types.ObjectId(req.user.reqUserId),
    );
    res.json({
      success: true,
      data: tasks,
    });
    eventEmitter.emit('getTasks', { getTasks: true, tasks });
  } catch (err: any) {
    if (err.name === 'BSONError') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid ObjectId',
          error: err,
        },
      });
    }

    next(err);
  }
}

export async function getTaskById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Task is being set in route authorization middleware
  res.json({
    success: true,
    data: req.user.task,
  });
}

export async function createTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const taskData: TaskCreateDTO = getTaskDataFrom(
    req.body,
    req.body.userId as string
  );

  try {
    const newTask = await taskServices.createTask(taskData);
    res.status(201).json({
      success: true,
      data: newTask,
    });
    eventEmitter.emit('createTask', { createTask: true, newTask });
  } catch (err: any) {
    next(err);
  }
}

export async function editTaskById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const updateData: TaskUpdateDTO = getTaskUpdateFrom(
    req.body
  );

  // console.log(updateData, req.body); // SCAFF

  try {
    const editedTask = await taskServices.editTaskById(
      req.user.task as TaskDoc,
      updateData,
    );
    res.json({
      success: true,
      data: editedTask,
    });
    eventEmitter.emit('editTaskById', { editTaskById: true, editedTask });
  } catch (err: any) {
    next(err);
  }
}

export async function deleteTaskById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
    const result = await taskServices.deleteTaskById(
      new Types.ObjectId(id),
    );
    res.status(204).json({ success: true, data: result });
    eventEmitter.emit('deleteTaskById', { data: {} });
  } catch (err: any) {
    next(err);
  }
}
