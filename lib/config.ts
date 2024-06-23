import * as AuthZ from "@/src/middlewares/authz-middleware";

export const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/';
// console.log(process.env.DATABASE_URI); // SCAFF
export const DATABASE_NAME = 'webtasks';

// In production, generate with `openssl rand -{hex|base64} 32`
export const TEST_SECRET = '+/sNCZWWbEheSMykpsQPXkv8TWUJ7xcxBvhqhIFWTnw=';

export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
};

export const Routes = {
  auth: {
    signin: { path: '/signin' },
    signout: { path: '/signout' },
    refreshToken: { path: 'refresh-token' },
  },
  user: {
    getUsers: { path: '/' },
    getUserById: { path: '/:id' },
    createUser: { path: '/' },
    editUserById: { path: '/:id' },
    deleteUserById: { path: ':id' },
  },
  task: {
    getTasks: { path: '/' },
    getTaskById: { path: '/:id' },
    createTask: { path: '/' },
    editTaskById: { path: '/:id' },
    deleteTaskById: { path: ':id' },
  },
};

export const routeAuthzMap = new Map();
const routeAuthzVector = [
  // tasks
  [Routes.task.createTask, AuthZ.verifyCreateTaskAuthz],
  [Routes.task.deleteTaskById, AuthZ.verifyDeleteTaskAuthz],
  [Routes.task.editTaskById, AuthZ.verifyEditTaskAuthz],
  [Routes.task.getTaskById, AuthZ.verifyReadTaskAuthz],
  [Routes.task.getTasks, AuthZ.verifyReadTasksAuthz],
  // users
  [Routes.user.createUser, AuthZ.verifyCreateUserAuthz],
  [Routes.user.deleteUserById, AuthZ.verifyDeleteUserAuthz],
  [Routes.user.editUserById, AuthZ.verifyEditUserAuthz],
  [Routes.user.getUserById, AuthZ.verifyReadUserAuthz],
  [Routes.user.getUsers, AuthZ.verifyReadUsersAuthz],
];

routeAuthzVector.forEach(([route, authz]) => routeAuthzMap.set(route, authz));

// Permissions for different categories of actors (users).
// Extra logic could be applied before op action is taken. E.g.,
// ...a req can only be deleted if it's not been approved yet;
// ...or a task can be read by a user/actor only if it's theirs.
export const TaskResourceRBAC = {
  permissions: {
    createOwnTask: [UserRoles.USER, UserRoles.ADMIN],
    createAnyTask: [UserRoles.ADMIN],
    readOwnTasks: [UserRoles.USER, UserRoles.ADMIN],
    readOwnTask: [UserRoles.USER, UserRoles.ADMIN],
    readAllTasks: [UserRoles.ADMIN],
    readAnyTasks: [UserRoles.ADMIN],
    readAnyTask: [UserRoles.ADMIN],
    editOwnTask: [UserRoles.USER, UserRoles.ADMIN],
    editAnyTask: [UserRoles.ADMIN],
    deleteOwnTask: [UserRoles.USER, UserRoles.ADMIN],
    deleteAnyTask: [UserRoles.ADMIN],
  },
};

export const UserResourceRBAC = {
  permissions: {
    createOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    createAnyUserAccount: [''],
    readOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    readAllUserAccounts: [UserRoles.ADMIN],
    readAnyUserAccount: [UserRoles.ADMIN],
    editOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    editAnyUserAccount: [UserRoles.ADMIN],
    deleteOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    deleteAnyUserAccount: [UserRoles.ADMIN],
  },
};
