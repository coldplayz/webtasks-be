/**
* Authentication controller.
* - at the moment, uses database auth services directly.
*/

const log = console.log // SCAFF

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import * as authServices from "@/src/services/auth.service";
import eventEmitter from "../events/api-events";
import { AuthenticatedRequest } from "@/types";
import { Types } from "mongoose";

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - see about integrating auth core business rules
// - data validation
// - data formatting
// - uniform response object format

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  // console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0]?.msg
    });
  }

  const { email, password } = req.body;

  // log(req.body); // SCAFF

  try {
    const user = await authServices.loginUser(email, password);
    // console.log('DECODED_TOKEN', accessToken, jwt.verify(accessToken, 'test+secret'));

    // Set options for cookies
    const options = {
      httpOnly: true,
      secure: true, // Enable in a production environment with HTTPS
    };

    // Set cookies with the generated tokens
    return res
      .status(200)
      .cookie("accessToken", user.accessToken, options)
      .cookie("refreshToken", user.refreshToken, options)
      .json({
        success: true,
        data: {
          user,
          message: "Logged in successfully",
        },
      });
    eventEmitter.emit('loginUser', { login: true, user: email });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function logoutUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Remove the refresh token from the user's information
    // console.log(req.user); // SCAFF
    const id: string = req.user.id;
    const result = await authServices.logoutUser(new Types.ObjectId(id));
    // console.log('result###->', result); // SCAFF

    // Set options for cookies
    const options = {
      httpOnly: true,
      secure: true, // Enable in a production environment with HTTPS
    };

    // Clear the access and refresh tokens in cookies
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        data: { message: "Logged out successfully" },
      });
    eventEmitter.emit('logoutUser', { data: 'Logout successfull!' });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json(
        { success: false, error: 'User not logged in' }
      );
    }
    next(err);
  }
};

export async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Retrieve the refresh token from cookies or request body
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // console.log(req.cookies, incomingRefreshToken); // SCAFF

  // If no refresh token is present, deny access with a 401 Unauthorized status
  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      error: "Refresh token not found"
    });
  }

  try {
    const user = await authServices.refreshAccessToken(incomingRefreshToken);

    // Set options for cookies
    const options = {
      httpOnly: true,
      secure: true, // Enable in a production environment with HTTPS
    };

    // Set the new tokens in cookies
    return res
      .status(200)
      .cookie("accessToken", user.accessToken, options)
      .cookie("refreshToken", user.refreshToken, options)
      .json({
        success: true,
        data: {
          user,
          message: "Access token refreshed",
        }
      });
    eventEmitter.emit('refreshToken', {
      tokens: {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json(
        {
          success: false,
          error: {
            message: 'Invalid token',
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

    return res.status(err.statusCode || 500).json({
      success: false,
      error: err
    });
  }
};
