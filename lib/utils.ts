import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import {
  TaskCreateDTO,
  TaskDoc,
  TaskQueryDTO,
  TaskUpdateDTO,
  RawTaskCreateDTO,
  RawTaskQueryDTO,
  RawTaskUpdateDTO,
  RawUserCreateDTO,
  RawUserQueryDTO,
  RawUserUpdateDTO,
  UserCreateDTO,
  UserDoc,
  ReqUserPermissions,
  UserQueryDTO,
  UserUpdateDTO,
} from "@/types";

const log = console.log; // SCAFF

// ======= Tasks =======

/**
* Given a task object, updates it for saving to db.
*/
export function updateTask(task: TaskDoc, updateObj: TaskUpdateDTO) {
  const q = updateObj;

  if (q.description) task.description = q.description;
  if (q.done) task.done = q.done;

  return task;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getTaskUpdateFrom(req: RawTaskUpdateDTO) {
  const q = req;
  const updateObj: TaskUpdateDTO = {};

  if (q.description) updateObj.description = q.description;
  if (q.done) updateObj.done = toBool(q.done);
  // log(req); // SCAFF
  // log(updateObj); // SCAFF

  return updateObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getTaskQueryFrom(
  req: RawTaskQueryDTO,
) {
  const q = req;
  const queryObj: TaskQueryDTO = {};

  if (q.description) queryObj.description = q.description;
  if (q.done) queryObj.done = toBool(q.done);
  if (q.userId) queryObj.userId = new Types.ObjectId(q.userId);
  if (q.createdAt) queryObj.createdAt = new Date(q.createdAt);
  if (q.updatedAt) queryObj.updatedAt = new Date(q.updatedAt);

  return queryObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getTaskDataFrom(req: RawTaskCreateDTO, uId: string) {
  const q = req;

  const description = q.description;
  const userId = new Types.ObjectId(uId);

  const reqData: TaskCreateDTO = {
    description,
    userId,
  };

  return reqData;
};

// ======= Users =======

/**
* Given a user object, updates it for saving to db.
*/
export function updateUser(user: UserDoc, updateObj: UserUpdateDTO) {
  const q = updateObj;

  if (q.email) user.email = q.email;
  if (q.firstName) user.firstName = q.firstName;
  if (q.lastName) user.lastName = q.lastName;
  if (q.role) user.role = q.role;

  return user;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getUserUpdateFrom(req: RawUserUpdateDTO) {
  const q = req;
  const updateObj: UserUpdateDTO = {};

  if (q.email) updateObj.email = q.email;
  if (q.firstName) updateObj.firstName = q.firstName;
  if (q.lastName) updateObj.lastName = q.lastName;
  if (q.role) updateObj.role = q.role;

  return updateObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getUserQueryFrom(req: RawUserQueryDTO) {
  const q = req;
  const queryObj: UserQueryDTO = {};

  if (q.email) queryObj.email = q.email;
  if (q.firstName) queryObj.firstName = q.firstName;
  if (q.lastName) queryObj.lastName = q.lastName;
  if (q.role) queryObj.role = q.role;
  if (q.createdAt) queryObj.createdAt = new Date(q.createdAt);
  if (q.updatedAt) queryObj.updatedAt = new Date(q.updatedAt);

  return queryObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getUserDataFrom(req: RawUserCreateDTO) {
  const q = req;

  const email = q.email;
  const firstName = q.firstName;
  const lastName = q.lastName;
  const password = q.password;
  const role = q.role;

  const reqData: UserCreateDTO = {
    email,
    firstName,
    lastName,
    password,
    role,
  };

  return reqData;
};

/**
 * Coverts true and false, as string, to boolean.
 */
function toBool(inp: boolean | string) {
  if (inp === 'true' || inp === true) return true;
  if (inp === 'false' || inp === false) return false;

  throw new Error('Arg must be true or false, as boolean or string literals.');
}
