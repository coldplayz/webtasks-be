/**
* Core business rules.
* - defines objects that make or save the business money.
* - implemented in such a way that they can function the same
*   if moved to a different application in the same organization.
* - entities - higher level policies - shouldn't know about
*   lower level implementation details/logic;
*   these will be injected to achieve dependency inversion.
*/

import {
  IBaseUserDTO,
  IUserCreateDTO,
  IUserQueryDTO,
  IUserUpdateDTO,
  IUserServicePlugin,
} from "./interfaces";

class UserEntity {
  service: IUserServicePlugin;

  constructor(servicePlugin: IUserServicePlugin) {
    this.service = servicePlugin;
  }

  createUser(userData: IUserCreateDTO) {
    return this.service.createUser(userData);
  };

  getUsers(queryObj: IUserQueryDTO) {
    return this.service.getUsers(queryObj);
  }

  getUserById(id: string) {
    return this.service.getUserById(id);
  }

  editUserById(id: string, updateObj: IUserUpdateDTO) {
    return this.service.editUserById(id, updateObj);
  }

  deleteUserById(id: string) {
    return this.service.deleteUserById(id);
  }
}

export default UserEntity;
