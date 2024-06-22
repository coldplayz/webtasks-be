/**
* Application-specific business rules.
* - can only depend on the higher-level core business rules (entities)
* - avoid dependencies on outer layers using dependency injection.
* - this is a demo/assessment, so not much by way of business rules.
*/

import UserEntity from "../../entities/user.entity";

export default function getUserById(userService, id) {
  // Inject dependency into the higher-level entity
  const userEntity = new UserEntity(userService);

  return userEntity.getUserById(id);
}
