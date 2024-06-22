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
  IBaseTaskDTO,
  ITaskCreateDTO,
  ITaskQueryDTO,
  ITaskUpdateDTO,
  ITaskServicePlugin,
} from "./interfaces";

class TaskEntity {
  service: ITaskServicePlugin;

  constructor(servicePlugin: ITaskServicePlugin) {
    this.service = servicePlugin;
  }

  createTask(taskData: ITaskCreateDTO) {
    return this.service.createTask(taskData);
  };

  getTasks(queryObj: ITaskQueryDTO) {
    return this.service.getTasks(queryObj);
  }

  getTaskById(id: string) {
    return this.service.getTaskById(id);
  }

  editTaskById(id: string, updateObj: ITaskUpdateDTO) {
    return this.service.editTaskById(id, updateObj);
  }

  deleteTaskById(id: string) {
    return this.service.deleteTaskById(id);
  }
}

export default TaskEntity;
