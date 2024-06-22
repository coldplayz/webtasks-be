/**
* Application-specific business rules.
* - can only depend on the higher-level core business rules (entities)
* - avoid dependencies on outer layers using dependency injection.
* - this is a demo/assessment, so not much by way of business rules.
*/

/**
* Use Case for task removal.
*
* - input: taskId, userId
* - output: empty object
*
* - algorithm:
*   - retrieve the task state
*     - if not found, throw
*   - retrieve the user state
*     - if not found, throw
*   - remove task from repo
*   - remove task ID from corresponding user state
*   - return an empty state
*/

// TODO:
// - see about integrating validation and auth with business rules
// - (fix): ensure that when a task is deleted,
//   its ref is also removed from the corresponding user.

import TaskEntity from "../../entities/task.entity";
import UserEntity from "../../entities/user.entity";

export default async function deleteTaskById(
  taskService,
  userService,
  taskId,
  userId
) {
  // Inject dependency into the higher-level entity
  const taskEntity = new TaskEntity(taskService);
  const userEntity = new UserEntity(userService);

  const existingTask = await taskEntity.getTaskById(taskId);

  if (!existingTask) {
    const error: Error & { statusCode?: number } = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const taskUser = await userEntity.getUserById(userId);

  if (!taskUser) {
    const error: Error & { statusCode?: number } = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const res =  await taskEntity.deleteTaskById(taskId);

  taskUser.tasks = taskUser.tasks.filter(
    (taskID) => taskID.toString() !== taskId.toString()
  );
  await taskUser.save();

  return res;
}
