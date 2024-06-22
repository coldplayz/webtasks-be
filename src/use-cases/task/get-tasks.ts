/**
* Application-specific business rules.
* - can only depend on the higher-level core business rules (entities)
* - avoid dependencies on outer layers using dependency injection.
* - this is a demo/assessment, so not much by way of business rules.
*/

import UserEntity from "../../entities/user.entity";

export default async function getTasks(userService, queryObj, userId) {
  // Inject dependency into the higher-level entity
  const userEntity = new UserEntity(userService);

  const user = await userEntity.getUserById(userId)

  if (!user) {
    const error: Error & { statusCode?: number } = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  let tasks = user.tasks;

  if (queryObj.done != undefined) {
    // TODO: see about doing this on the server (aggregation?)
    tasks = tasks.filter((task) => task.done === queryObj.done);
  }

  return tasks;
}
