/**
* User and Task entity interfaces and types.
* - inputs/method args, and plugins must satisfy these interfaces.
*/

// TODO:
// - types are still coupled to the web framework;
//   see about achieving true decoupling.

import { HydratedDocument, Model, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { Request } from "express";

type RequestUser = DecodedAccessToken & {
  permissions: {
    canCreateOwn?: boolean;
    canCreateAny?: boolean;
    canReadOwn?: boolean;
    canReadAny?: boolean;
    canReadAll?: boolean;
    canEditOwn?: boolean;
    canEditAny?: boolean;
    canApproveAny?: boolean;
    canDeclineAny?: boolean;
    canDeleteOwn?: boolean;
    canDeleteAny?: boolean;
  },
  reqUserId?: string;
  task?: TaskDoc;
};
type AuthenticatedRequest = Request & {
  user: RequestUser;
};
type ReqUserPermissions = RequestUser['permissions'];

// ======= Users =======

type BaseUserDTO = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
  role?: string;
}
type RawBaseUserDTO = {
  [k in keyof BaseUserDTO]: string;
};

type UserCreateDTO = Required<Omit<BaseUserDTO, 'refreshToken' | 'role'>> & { role?: string };
type RawUserCreateDTO = {
  [k in keyof UserCreateDTO]: string;
};

type UserQueryDTO = BaseUserDTO & {
  createdAt?: Date;
  updatedAt?: Date;
};
type RawUserQueryDTO = {
  [k in keyof UserQueryDTO]: string;
}

type UserUpdateDTO = Omit<BaseUserDTO, 'refreshToken' | 'password'>;
export type RawUserUpdateDTO = {
  [k in keyof UserUpdateDTO]: string;
}

type DecodedAccessToken = {
  id: string;
  email: string;
  role: string;
};
type AccessToken = string;

type DecodedRefreshToken = {
  id: string;
};
type RefreshToken = string;

type UserMethods = {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): AccessToken;
  generateRefreshToken(): RefreshToken;
};

// How you expect a User to be stored in the db
type User = Required<BaseUserDTO> & {
  createdAt: Date;
  updatedAt: Date;
  // __v: number;
};

type UserDoc = HydratedDocument<User>;

type UserObj = (UserDoc & UserMethods) | null;

// ====== Tasks =======

// With actual data type...
type BaseTaskDTO = {
  description?: string;
  done?: boolean;
  userId?: Types.ObjectId,
}
// ...and as retrieved from HTTP request.
type RawBaseTaskDTO = {
  [k in keyof BaseTaskDTO]: string;
};

type TaskCreateDTO = Required<Omit<BaseTaskDTO, 'done'>>;
type RawTaskCreateDTO = { [k in keyof TaskCreateDTO]: string };

type TaskQueryDTO = BaseTaskDTO & {
  createdAt?: Date;
  updatedAt?: Date;
};
type RawTaskQueryDTO = { [k in keyof TaskQueryDTO]: string };

type TaskUpdateDTO = Omit<BaseTaskDTO, 'userId'>;
type RawTaskUpdateDTO = { [k in keyof TaskUpdateDTO]: string };

// How you expect a Request to be stored in the db
type Task = Required<BaseTaskDTO> & {
  createdAt: Date;
  updatedAt: Date;
  // __v: number;
};

// After calling `new Model(objDef)`
type TaskDoc = HydratedDocument<Task>;

/*
interface ITaskServicePlugin {
  getTasks(queryObj: ITaskQueryDTO): Promise<TaskDoc[]>;
  getTaskById(id: string): Promise<TaskDoc>;
  createTask(taskData: ITaskCreateDTO): Promise<TaskDoc>;
  editTaskById(id: string, updateObj: ITaskUpdateDTO): Promise<TaskDoc>;
  deleteTaskById(id: string): Promise<ReturnType<typeof Model.deleteOne>>;
};
*/

/*
export interface IUserServicePlugin {
  getUsers(queryObj: IUserQueryDTO): Promise<UserDoc[]>;
  getUserById(id: string): Promise<UserDoc>;
  createUser(userData: IUserCreateDTO): Promise<UserDoc>;
  editUserById(id: string, updateObj: IUserUpdateDTO): Promise<UserDoc>;
  deleteUserById(id: string): Promise<ReturnType<typeof Model.deleteOne>>;
};
*/
