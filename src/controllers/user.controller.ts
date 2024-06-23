/**
* Formats use-case input and output.
* - ensures input data is in the form the
*   application-specific business rules/logic want it.
* - will pass dependencies to be injected to use cases,
*   thus knowing about and depending on their import.
*/

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import * as userServices from "@/src/services/user.service";
import {
  AuthenticatedRequest,
  RawUserQueryDTO,
  UserCreateDTO,
  UserQueryDTO,
  UserUpdateDTO,
} from "@/types";
import { getUserDataFrom, getUserQueryFrom, getUserUpdateFrom } from "@/lib/utils";
import eventEmitter from "@/src/events/api-events";
import { Types } from "mongoose";

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - data validation
// - data formatting

export async function getUsers(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const queryObj: UserQueryDTO = getUserQueryFrom(req.query);

  try {
    const users = await userServices.getUsers(queryObj);
    res.json({
      success: true,
      data: users,
    });
    eventEmitter.emit('getUsers', { getUsers: true, users });
  } catch (err: any) {
    next(err);
  }
}

export async function getUserById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  try {
    const user = await userServices.getUserById(new Types.ObjectId(id));
    res.json({
      success: true,
      data: user,
    });
    eventEmitter.emit('getUserById', { getUserById: true, user });
  } catch (err: any) {
    next(err);
  }
}

export async function createUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  // console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0]?.msg
    });
  }

  const userData: UserCreateDTO = getUserDataFrom(req.body);

  try {
    const newUser = await userServices.createUser(userData);
    res.status(201).json({
      success: true,
      data: newUser,
    });
    eventEmitter.emit('createUser', { createUser: true, newUser });
  } catch (err: any) {
    next(err);
  }
}

export async function editUserById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const updateData: UserUpdateDTO = getUserUpdateFrom(req.body);

  try {
    const editedUser = await userServices.editUserById(
      new Types.ObjectId(id),
      updateData,
    );
    res.json({
      success: true,
      data: editedUser,
    });
    eventEmitter.emit('editUserById', { editUserById: true, editedUser });
  } catch (err: any) {
    next(err);
  }
}

export async function deleteUserById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const result = await userServices.deleteUserById(new Types.ObjectId(id));
    res.status(204).json({ success: true, data: result });
    eventEmitter.emit('deleteUserById', { data: {} });
  } catch (err: any) {
    next(err);
  }
}
