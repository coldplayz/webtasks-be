/**
* Formats use-case input and output.
* - ensures input data is in the form the
*   application-specific business rules/logic want it.
* - will pass dependencies to be injected to use cases,
*   thus knowing about and depending on their import.
*/

import {Request, Response, NextFunction} from "express";

import * as userService from "../data-access/services/user.service";
import * as taskService from "../data-access/services/task.service";
import userUC from "../use-cases/user";
import taskUC from "../use-cases/task";
import eventEmitter from "../events/api-events";
import {
  ITaskCreateDTO,
  ITaskQueryDTO,
  ITaskUpdateDTO,
} from "../entities/interfaces";

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - data validation
// - data formatting
// - custom error handler

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  const queryProps = ['done'];
  const queryObj: ITaskQueryDTO = {};

  queryProps.forEach((prop) => {
    if (req.query[prop]) queryObj[prop] = req.query[prop];
  });

  switch (req.query.done) {
    case 'false':
      queryObj.done = false;
      break;
    case 'true':
      queryObj.done = true;
      break;
  }

  try {
    const tasks = await taskUC.getTasks(
      userService,
      queryObj,
      req.user.id
    );
    res.json({ tasks });
    eventEmitter.emit('getTasks', { getTasks: true, tasks });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const task = await taskUC.getTaskById(taskService, id);
    res.json({ task });
    eventEmitter.emit('getTaskById', { getTaskById: true, task });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  const bodyProps = ['description'];
  const taskData: ITaskCreateDTO = {};

  bodyProps.forEach((prop) => {
    if (req.body[prop]) taskData[prop] = req.body[prop];
  });

  try {
    const newTask = await taskUC.createTask(
      taskService,
      userService,
      taskData,
      req.user.id
    );
    res.status(201).json({ newTask });
    eventEmitter.emit('createTask', { createTask: true, newTask });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function editTaskById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateData: { [key: string]: string | boolean } = {};

  const bodyProps = ['description', 'done'];
  bodyProps.forEach((prop) => {
    if (req.body[prop] != undefined) updateData[prop] = req.body[prop];
  });

  switch (updateData.done) {
    case 'false':
      updateData.done = false;
      break;
    case 'true':
      updateData.done = true;
      break;
  }

  // console.log(updateData, req.body); // SCAFF

  try {
    const editedTask = await taskUC.editTaskById(taskService, id, updateData);
    res.json({editedTask});
    eventEmitter.emit('editTaskById', { editTaskById: true, editedTask });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function deleteTaskById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const result = await taskUC.deleteTaskById(
      taskService,
      userService,
      id,
      req.user.id
    );
    res.status(204).json({ success: true, result });
    eventEmitter.emit('deleteTaskById', { data: {} });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}
