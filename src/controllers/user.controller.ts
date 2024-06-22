/**
* Formats use-case input and output.
* - ensures input data is in the form the
*   application-specific business rules/logic want it.
* - will pass dependencies to be injected to use cases,
*   thus knowing about and depending on their import.
*/

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import * as userService from "../data-access/services/user.service";
import userUC from "../use-cases/user";
import eventEmitter from "../events/api-events";
import {
  IUserCreateDTO,
  IUserQueryDTO,
  IUserUpdateDTO,
} from "../entities/interfaces";

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - data validation
// - data formatting

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  const queryProps = ['id', 'firstName', 'lastName', 'email'];
  const queryObj: IUserQueryDTO = {};

  queryProps.forEach((prop) => {
    if (req.query[prop]) queryObj[prop] = req.query[prop];
  });

  try {
    const users = await userUC.getUsers(userService, queryObj);
    res.json({users});
    eventEmitter.emit('getUsers', { getUsers: true, users });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const user = await userUC.getUserById(userService, id);
    res.json({user});
    eventEmitter.emit('getUserById', { getUserById: true, user });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  // console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0]?.msg
    });
  }

  const { firstName, lastName, email, password } = req.body;
  const userData: IUserCreateDTO = {
    firstName,
    lastName,
    email,
    password,
  };

  try {
    const newUser = await userUC.createUser(userService, userData);
    res.status(201).json({ newUser });
    eventEmitter.emit('createUser', { createUser: true, newUser });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function editUserById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateData: IUserUpdateDTO = {};

  const bodyProps = ['password', 'firstName', 'lastName', 'email'];
  bodyProps.forEach((prop) => {
    if (req.body[prop]) updateData[prop] = req.body[prop];
  });

  try {
    const editedUser = await userUC.editUserById(userService, id, updateData);
    res.json({ editedUser });
    eventEmitter.emit('editUserById', { editUserById: true, editedUser });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}

export async function deleteUserById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const result = await userUC.deleteUserById(userService, id);
    res.status(204).json({ success: true, result });
    eventEmitter.emit('deleteUserById', { data: {} });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err });
  }
}
