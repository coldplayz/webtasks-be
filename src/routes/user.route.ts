import { NextFunction, Request, Response, Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  editUserById,
  deleteUserById,
} from "../controllers/user.controller";
import { verifyJWT } from "@/src/middlewares/authn-middleware";
import {
  loginValidator,
  signupValidator,
} from "@/src/middlewares/validation-middleware";
import { AuthenticatedRequest } from "@/types";

const userRouter = Router();

// Get multiple users
// userRouter.get('/', (req, res) => res.json({ route: 'GET /users' }));
userRouter.get(
  '/',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    getUsers(req as AuthenticatedRequest, res, next);
  }
);

// Get one user
// userRouter.get('/:id', (req, res) => res.json({ route: 'GET /users/:id' }));
userRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    getUserById(req as AuthenticatedRequest, res, next);
  }
);

// Create new user
// userRouter.post('/', (req, res) => res.json({ route: 'POST /users' }));
userRouter.post(
  '/',
  signupValidator,
  (req: Request, res: Response, next: NextFunction) => {
    createUser(req as AuthenticatedRequest, res, next);
  }
);

// Update a user
// userRouter.put('/:id', (req, res) => res.json({ route: 'PUT /users/:id' }));
userRouter.put(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    editUserById(req as AuthenticatedRequest, res, next);
  }
);

// Delete a user
// userRouter.delete('/:id', (req, res) => res.json({ route: 'DELETE /users/:id' }));
userRouter.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    deleteUserById(req as AuthenticatedRequest, res, next);
  }
);

export default userRouter;
