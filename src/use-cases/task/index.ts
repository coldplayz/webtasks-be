import createTask from "./create-task";
import getTasks from "./get-tasks";
import getTaskById from "./get-task-byId";
import editTaskById from "./edit-task-byId";
import deleteTaskById from "./delete-task-byId";

// TODO:
// - instantiate entities here and pass in (bind)
// - look into bringing validation and auth down to the
//   use cases, which are the app-specific business rules.

export default {
  createTask,
  getTasks,
  getTaskById,
  editTaskById,
  deleteTaskById,
}
