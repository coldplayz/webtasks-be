import { Router } from "express";

import {
  getTasks,
  getTaskById,
  createTask,
  editTaskById,
  deleteTaskById,
} from "../controllers/task.controller";
import { verifyJWT } from "../middlewares/middleware";

const taskRouter = Router();

// Get multiple tasks
taskRouter.get('/', verifyJWT, getTasks);

// Get one task
taskRouter.get('/:id', verifyJWT, getTaskById);

// Create new task
taskRouter.post('/', verifyJWT, createTask);

// Update a task
taskRouter.put('/:id', verifyJWT, editTaskById);

// Delete a task
taskRouter.delete('/:id', verifyJWT, deleteTaskById);

export default taskRouter;
