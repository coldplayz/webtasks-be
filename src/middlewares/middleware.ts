/**
 * Auth middleware.
 */

import * as jwt from "jsonwebtoken";
import User from "../data-access/models/user.model";
import { body } from "express-validator";

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email CANNOT be empty")
        .bail()
        .isEmail()
        .withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password CANNOT be empty"),
];

export const signupValidator = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("Firstname CANNOT be empty"),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Lastname CANNOT be empty"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email CANNOT be empty")
        .bail()
        .isEmail()
        .withMessage("Email is invalid")
        .bail(),
    body("password")
        .notEmpty()
        .withMessage("Password CANNOT be empty")
        .bail(),
        // .isLength({ min: 4 })
        // .withMessage("Password MUST be at least 4 characters long"),
];

const testSecret = 'test+secret';

export const verifyJWT = async (req, res, next) => {
  try {
    // Look for the token in cookies or headers
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    // console.log('TOKEN', token); // SCAFF

    // If there's no token, deny access with a 401 Unauthorized status
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    // Check if the token is valid using a secret key
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || testSecret
    );

    // Get the user linked to the token
    const user = await User.findById(decodedToken?.id);

    // If the user isn't found, deny access with a 404 Not Found status
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info to the request for further use
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json(
        {
          success: false,
          error: {
            message: 'User not logged in',
            error: err,
          },
        }
      );
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json(
        {
          success: false,
          error: {
            message: 'Expired token',
            error: err,
          },
        }
      );
    }
    return res.status(err.statusCode || 500).json({ message: err });
  }
};
