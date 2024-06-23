import { NextFunction, Request, Response, Router } from "express";

import {
  getTasks,
  getTaskById,
  createTask,
  editTaskById,
  deleteTaskById,
} from "../controllers/task.controller";
import { verifyJWT } from "@/src/middlewares/authn-middleware";
import { loginValidator } from "@/src/middlewares/validation-middleware";
import { AuthenticatedRequest } from "@/types";

const taskRouter = Router();

// Get multiple tasks
taskRouter.get(
  '/',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    getTasks(req as AuthenticatedRequest, res, next);
  }
);

// Get one task
taskRouter.get(
  '/:id',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    getTaskById(req as AuthenticatedRequest, res, next);
  }
);

// Create new task
taskRouter.post(
  '/',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    createTask(req as AuthenticatedRequest, res, next);
  }
);

// Update a task
taskRouter.put(
  '/:id',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    editTaskById(req as AuthenticatedRequest, res, next);
  }
);

// Delete a task
taskRouter.delete(
  '/:id',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    deleteTaskById(req as AuthenticatedRequest, res, next);
  }
);

export default taskRouter;
