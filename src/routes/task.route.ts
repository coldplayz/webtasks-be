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
import { Routes, routeAuthzMap } from "@/lib/config";

const taskRouter = Router();

// Get multiple tasks
taskRouter.get(
  '/',
  verifyJWT,
  routeAuthzMap.get(Routes.task.getTasks),
  (req: Request, res: Response, next: NextFunction) => {
    getTasks(req as AuthenticatedRequest, res, next);
  }
);

// Get one task
taskRouter.get(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.task.getTaskById),
  (req: Request, res: Response, next: NextFunction) => {
    getTaskById(req as AuthenticatedRequest, res, next);
  }
);

// Create new task
taskRouter.post(
  '/',
  verifyJWT,
  routeAuthzMap.get(Routes.task.createTask),
  (req: Request, res: Response, next: NextFunction) => {
    createTask(req as AuthenticatedRequest, res, next);
  }
);

// Update a task
taskRouter.put(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.task.editTaskById),
  (req: Request, res: Response, next: NextFunction) => {
    editTaskById(req as AuthenticatedRequest, res, next);
  }
);

// Delete a task
taskRouter.delete(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.task.deleteTaskById),
  (req: Request, res: Response, next: NextFunction) => {
    deleteTaskById(req as AuthenticatedRequest, res, next);
  }
);

export default taskRouter;
