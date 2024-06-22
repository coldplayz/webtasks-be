import createUser from "./create-user";
import getUsers from "./get-users";
import getUserById from "./get-user-byId";
import editUserById from "./edit-user-byId";
import deleteUserById from "./delete-user-byId";

// TODO:
// - instantiate entities here and pass in (bind)
// - look into bringing validation and auth down to the
//   use cases, which are the app-specific business rules.

export default {
  createUser,
  getUsers,
  getUserById,
  editUserById,
  deleteUserById,
}
