import { Request, Response, NextFunction } from "express";

import {
  TaskResourceRBAC,
  UserResourceRBAC,
} from "@/lib/config";
import { AuthenticatedRequest, TaskDoc } from "@/types";
import {
  getTaskById,
} from "@/src/services/task.service";
import { Types } from "mongoose";
import { ApiError } from "@/lib/error-handling";

const log = console.log // SCAFF

// ======= Tasks =======

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadTasksAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (TaskResourceRBAC.permissions.readAllTasks.includes(role)) {
    // read all, or specified, users' tasks
    req.user.reqUserId = (req.query.userId as string) || undefined;
    req.user.permissions.canReadAll = true;
    return next();
  }

  if (TaskResourceRBAC.permissions.readOwnTasks.includes(role)) {
    req.user.reqUserId = (req.query.userId as string) || req.user.id;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  unauthorize(res, 'Cannot read all or own tasks.');
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadTaskAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  let task: TaskDoc | null = null;

  try {
    task = await getTaskById(new Types.ObjectId(req.params.id));
    if (!task) throw new ApiError('Task not found', 404);
  } catch (err) {
    return next(err);
  }

  req.user.task = task;

  if (req.user.id !== task.userId.toString()) {
    // Not own resource; check if permitted for any
    if (TaskResourceRBAC.permissions.readAnyTask.includes(role)) {
      // req.user.reqUserId = (req.query.userId as string) || undefined;
      req.user.permissions.canReadAny = true;
      return next();
    }

    return unauthorize(res, 'Cannot read just any task.');
  }

  // Own resource

  if (TaskResourceRBAC.permissions.readOwnTask.includes(role)) {
    // req.user.reqUserId = (req.query.userId as string) || req.user.id;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  // Not permitted to access even own resource;
  unauthorize(res, 'Cannot read own task');
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyCreateTaskAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (req.user.id !== req.body.userId) {
    // Not own resource; check if permitted for any
    if (TaskResourceRBAC.permissions.createAnyTask.includes(role)) {
      // Likely admin; if userId specified in body, use it
      req.body.userId = req.body.userId || req.user.id;
      req.user.permissions.canCreateAny = true;
      return next();
    }

    if (req.body.userId != null) {
      // User without admin rights attempted illegal action
      return unauthorize(res, 'Cannot create just any task.');
    }
  }

  // Own resource

  if (TaskResourceRBAC.permissions.createOwnTask.includes(role)) {
    // Can only create own
    req.body.userId || void (req.body.userId = req.user.id);
    req.user.permissions.canCreateOwn = true;
    return next();
  }

  // Not permitted to access even own resource;
  unauthorize(res, 'Cannot create own task');
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyEditTaskAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  let task: TaskDoc | null = null;

  try {
    task = await getTaskById(new Types.ObjectId(req.params.id));
    if (!task) throw new ApiError('Task not found', 404);
  } catch (err) {
    return next(err);
  }

  req.user.task = task;

  if (req.user.id !== task.userId.toString()) {
    // Not own resource; check if permitted for any
    if (TaskResourceRBAC.permissions.editAnyTask.includes(role)) {
      req.user.permissions.canEditAny = true;
      return next();
    }

    return unauthorize(res, 'Cannot edit just any task.');
  }

  // Own resource

  if (TaskResourceRBAC.permissions.editOwnTask.includes(role)) {
    req.user.permissions.canEditOwn = true;
    return next();
  }

  // Not permitted to access even own resource;
  unauthorize(res, 'Cannot edit own task');
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyDeleteTaskAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  let task: TaskDoc | null = null;

  try {
    task = await getTaskById(new Types.ObjectId(req.params.id));
    if (!task) throw new ApiError('Task not found', 404);
  } catch (err) {
    return next(err);
  }

  if (req.user.id !== task.userId.toString()) {
    // Not own resource; check if permitted for any
    if (TaskResourceRBAC.permissions.deleteAnyTask.includes(role)) {
      req.user.permissions.canDeleteAny = true;
      return next();
    }

    return unauthorize(res, 'Cannot delete just any task.');
  }

  // Own resource

  if (TaskResourceRBAC.permissions.deleteOwnTask.includes(role)) {
    req.user.permissions.canDeleteOwn = true;
    return next();
  }

  // Not permitted to access even own resource;
  unauthorize(res, 'Cannot delete own task');
}

// ======= Users =======

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadUsersAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (UserResourceRBAC.permissions.readAllUserAccounts.includes(role)) {
    // read all, or specified, users' tasks
    req.user.reqUserId = (req.query.userId as string) || undefined;
    req.user.permissions.canReadAll = true;
    return next();
  }

  if (UserResourceRBAC.permissions.readOwnUserAccount.includes(role)) {
    req.user.reqUserId = (req.query.userId as string) || req.user.id;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  unauthorize(res, 'Cannot read all or own user account.');
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadUserAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (req.user.id !== req.params.id) {
    // Not own resource; check if permitted for any
    if (UserResourceRBAC.permissions.readAnyUserAccount.includes(role)) {
      req.user.permissions.canReadAny = true;
      return next();
    }

    return unauthorize(res, 'Cannot read just any user.');
  }

  // Own resource

  if (UserResourceRBAC.permissions.readOwnUserAccount.includes(role)) {
    req.user.permissions.canReadOwn = true;
    return next();
  }

  // Not permitted to access even own resource;
  unauthorize(res, 'Cannot read own user account');
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyCreateUserAuthz(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // For this app, not even admins are allowed to create...
  // ...other user accounts. Create only own account.
  next();
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyEditUserAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (req.user.id !== req.params.id) {
    // Not own resource; check if permitted for any
    if (UserResourceRBAC.permissions.editAnyUserAccount.includes(role)) {
      req.user.permissions.canEditAny = true;
      return next();
    }

    return unauthorize(res, 'Cannot edit just any user.');
  }

  // Own resource

  if (UserResourceRBAC.permissions.editOwnUserAccount.includes(role)) {
    req.user.permissions.canEditOwn = true;
    return next();
  }

  // Not permitted to access even own resource;
  unauthorize(res, 'Cannot edit own user account');
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyDeleteUserAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (req.user.id !== req.params.id) {
    // Not own resource; check if permitted for any
    if (UserResourceRBAC.permissions.deleteAnyUserAccount.includes(role)) {
      req.user.permissions.canDeleteAny = true;
      return next();
    }

    return unauthorize(res, 'Cannot delete just any user.');
  }

  // Own resource

  if (UserResourceRBAC.permissions.deleteOwnUserAccount.includes(role)) {
    req.user.permissions.canDeleteOwn = true;
    return next();
  }

  // Not permitted to access even own resource;
  unauthorize(res, 'Cannot delete own user account');
}

const unauthorize = (res: Response, message: string) => {
  return res.status(403).json({
    success: false,
    error: message,
  });
};
