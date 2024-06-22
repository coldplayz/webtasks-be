import { Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  editUserById,
  deleteUserById,
} from "../controllers/user.controller";
import {
  verifyJWT,
  signupValidator,
} from "../middlewares/middleware";

const userRouter = Router();

// Get multiple users
// userRouter.get('/', (req, res) => res.json({ route: 'GET /users' }));
userRouter.get('/', verifyJWT, getUsers);

// Get one user
// userRouter.get('/:id', (req, res) => res.json({ route: 'GET /users/:id' }));
userRouter.get('/:id', getUserById);

// Create new user
// userRouter.post('/', (req, res) => res.json({ route: 'POST /users' }));
userRouter.post('/', signupValidator, createUser);

// Update a user
// userRouter.put('/:id', (req, res) => res.json({ route: 'PUT /users/:id' }));
userRouter.put('/:id', editUserById);

// Delete a user
// userRouter.delete('/:id', (req, res) => res.json({ route: 'DELETE /users/:id' }));
userRouter.delete('/:id', deleteUserById);

export default userRouter;
