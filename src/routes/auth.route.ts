import { NextFunction, Request, Response, Router } from "express";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { verifyJWT } from "@/src/middlewares/authn-middleware";
import { loginValidator } from "@/src/middlewares/validation-middleware";
import { AuthenticatedRequest } from "@/types";

const authRouter = Router();

// Login route
authRouter.post('/signin', loginValidator, loginUser);

// Logout
authRouter.post(
  '/signout',
  verifyJWT,
  // no authz currently; can only log out self
  // TODO: add feature for admin to logout any user
  (req: Request, res: Response, next: NextFunction) => {
    logoutUser(req as AuthenticatedRequest, res, next);
  }
);

// Refresh token
authRouter.post('/refresh-token', refreshAccessToken);

export default authRouter;
