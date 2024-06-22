/**
* Module for providing database services and logic for the User model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import User from "../models/user.model";
// import { Document } from "mongoose";

export async function getUsers(queryObj) {
  return User.find(queryObj);
}

export async function getUserById(id) {
  return User.findById(id);
}

export async function createUser(userData) {
  const newUser = new User(userData);
  await newUser.save();

  return newUser;
}

export async function editUserById(id, updateObj) {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  Object.entries(updateObj).forEach(([k, v]) => {
    existingUser[k] = v;
  });

  existingUser.save();

  return existingUser;
}

export async function deleteUserById(id) {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return User.deleteOne({ _id: id });
}
