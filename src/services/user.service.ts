/**
* Module for providing database services and logic for the User model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import { UserCreateDTO, UserDoc, UserObj, UserQueryDTO, UserUpdateDTO } from "@/types";
import User from "../models/user.model";
import { Types } from "mongoose";
import { updateUser } from "@/lib/utils";
import { ApiError } from "@/lib/error-handling";
// import { Document } from "mongoose";

export async function getUsers(queryObj: UserQueryDTO) {
  return User.find(queryObj);
}

export async function getUserById(id: Types.ObjectId) {
  return User.findById(id);
}

export async function createUser(userData: UserCreateDTO) {
  const newUser = new User(userData);
  await newUser.save();

  return newUser;
}

export async function editUserById(
  id: Types.ObjectId,
  updateObj: UserUpdateDTO,
) {
  const existingUser: UserDoc | null = await User.findById(id);
  if (existingUser == null) {
    throw new ApiError('User not found', 404);
  }

  const updatedUser = updateUser(existingUser, updateObj);

  updatedUser.save();

  return updatedUser;
}

export async function deleteUserById(id: Types.ObjectId) {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new ApiError('User not found', 404);
  }

  return User.deleteOne({ _id: id });
}
