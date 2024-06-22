/**
* Application-specific business rules.
* - can only depend on the higher-level core business rules (entities)
* - avoid dependencies on outer layers using dependency injection.
* - this is a demo/assessment, so not much by way of business rules.
*/

/**
* Use Case for task creation.
*
* - input: taskData, userId
* - output: new task data
*
* - algorithm:
*   - create new task
*   - save to database
*   - link it to a user in database
*   - return new task object.
*/

// TODO:
// - see about integrating validation and auth with business rules

import TaskEntity from "../../entities/task.entity";
import UserEntity from "../../entities/user.entity";

export default async function createTask(
  taskService,
  userService,
  taskData,
  userId
) {
  // Inject dependency into the higher-level entities
  const taskEntity = new TaskEntity(taskService);
  const userEntity = new UserEntity(userService);

  const taskUser = await userEntity.getUserById(userId);

  if (!taskUser) {
    const error: Error & { statusCode?: number } = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const newTask = await taskEntity.createTask(taskData);

  // Link task to user
  taskUser.tasks.push(newTask._id);
  await taskUser.save();

  return newTask;
}
