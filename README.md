# Task Management API

A simple task-management demo. Implemented with Clean Architecture in mind.

## Setup

Clone the repo:

```bash
git clone https://github.com/coldplayz/neyo-task-management.git
```

`cd` to the clone repo and install dependencies:

```bash
cd neyo-task-management
npm install
```

## Basic Usage

Before starting the server, ensure you have an instance of MongoDB running (tested with MongoDB v6.1.0).

Also, you can optionally set the following environment variables:

| Name         | Description                                                   |
| ------------ | :------------------------------------------------------------ |
| `PORT`       | **Optional**. Server port. Default: `3456`.                   |

Start the dev server:
```bash
npm run dev
```

Make requests to the endpoints
```bash
curl http://localhost:3456/
```

That's the sanity check endpoint. It returns a simple object:
```json
{
  "success": true,
  "data": "LIVE"
}
```

### Socket Event Stream

The API also exposes a socket stream for notifying of events, using socket.io.

These events are related to CRUD operations on the API, and include:

- createUser
- getUsers
- getUserById
- editUserById
- deleteUserById
- login
- logout
- refreshToken
- createTask
- getTasks
- getTaskById
- editTaskById
- deleteTaskById

There's also a generic `apiEvent` event that is emitted after a request
to the sanity check endpoint (`/`).

Subscribe to any of these events onbthe clients to get
updates, with some support for connection recovery.

## API Endpoints

### Create User (public)

Create a new user

```bash
POST /api/v1/users
```

#### Request Body

| Name        | Type     | Description                       |
| ----------- | :------- | :-------------------------------- |
| `firstName` | `string` | **Required**. User's first name   |
| `lastName`  | `string` | **Required**. User's last name    |
| `email`     | `string` | **Required**. User's unique email |
| `password`  | `string` | **Required**. User's password     |

#### Failure Response

```bash
Status: 401 Unauthorized
```

#### Success Response

```bash
Status: 201 Created
```

Returns the newly created user object.

### Get Multiple Users (public)

Get multiple users, filterable by query params. Public at present for testing purposes.

```bash
GET /api/v1/users
```

#### Request Query

| Name        | Type     | Description                       |
| ----------- | :------- | :-------------------------------- |
| `firstName` | `string` | **Optional**. User's first name   |
| `lastName`  | `string` | **Optional**. User's last name    |
| `email`     | `string` | **Optional**. User's unique email |
| `role`      | `string` | **Optional**. User's role         |

#### Failure Response

```bash
Status: 500 Internal Server Error
```

#### Success Response

```bash
Status: 200 OK
```

Returns user objects meeting the query criteria, or all if no criteria.

### Get User by ID (public)

Get a specific user using their unique database ID. Public at present for testing purposes.

```bash
GET /api/v1/users/:id
```

#### Failure Response

```bash
Status: 404 Not Found
```

#### Success Response

```bash
Status: 200 OK
```

Returns a specific user object.

### Update a User by ID (public)

Update a specific user's data. Public at present for testing purposes.

```bash
PUT /api/v1/users/:id
```

#### Request Body

| Name        | Type     | Description                       |
| ----------- | :------- | :-------------------------------- |
| `firstName` | `string` | **Optional**. User's first name   |
| `lastName`  | `string` | **Optional**. User's last name    |
| `email`     | `string` | **Optional**. User's unique email |
| `password`  | `string` | **Optional**. User's password     |

#### Failure Response

```bash
Status: 404 Not Found
```

#### Success Response

```bash
Status: 200 OK
```

Returns the updated user object.

### Delete User by ID (public)

Remove a specific user using their unique database ID. Public at present for testing purposes.

```bash
DELETE /api/v1/users/:id
```

#### Failure Response

```bash
Status: 404 Not Found
```

#### Success Response

```bash
Status: 204 No Content
```

Removes the specific user from the database.

### Login (public)

Logs a user in by providing access and refresh tokens.

```bash
POST /api/v1/auth/login
```

#### Request Body

| Name        | Type     | Description                       |
| ----------- | :------- | :-------------------------------- |
| `email`     | `string` | **Required**. User's unique email |
| `password`  | `string` | **Required**. User's password     |

#### Failure Response

```bash
Status: 401 Unauthorized
```

#### Success Response

```bash
Status: 200 OK
```

Returns access and refresh tokens for accessing private endpoints.

### Logout (private)

Sign a logged-in user out of their session.

```bash
POST /api/v1/auth/logout
```

#### Failure Response

```bash
Status: 401 Unauthorized
```

#### Success Response

```bash
Status: 200 OK
```

### Refresh User Token (public)

For a valid refresh token, generate and return a new access (and refresh) token.

```bash
GET /api/v1/auth/refresh-token
```

#### Failure Response

```bash
Status: 401 Unauthorized
```

#### Success Response

```bash
Status: 201 Created
```

Returns new access and refresh tokens.

### Create Task (private)

Create a new user task.

```bash
POST /api/v1/tasks
```

#### Request Body

| Name          | Type     | Description                         |
| ------------- | :------- | :---------------------------------- |
| `description` | `string` | **Required**. Details of the task   |

#### Failure Response

```bash
Status: 401 Unauthorized
```

#### Success Response

```bash
Status: 201 Created
```

Returns the newly created task object.

### Get Multiple Tasks (private)

Get multiple tasks, filterable by query params and specific to the authenticated user.

```bash
GET /api/v1/tasks
```

#### Request Query

| Name        | Type      | Description                       |
| ----------- | :-------- | :-------------------------------- |
| `done`      | `boolean` | **Optional**. Task pending state. |

#### Failure Response

```bash
Status: 401 Unauthorized
```

#### Success Response

```bash
Status: 200 OK
```

Returns task objects meeting the query criteria, or all if no criteria.

### Get Task by ID (public)

Get a specific task using their unique database ID. Public at present for testing purposes.

```bash
GET /api/v1/tasks/:id
```

#### Failure Response

```bash
Status: 404 Not Found | 401 Unauthorized
```

#### Success Response

```bash
Status: 200 OK
```

Returns a specific task object.

### Update a Task by ID (private)

Update a specific user task.

```bash
PUT /api/v1/tasks/:id
```

#### Request Body

| Name          | Type      | Description                       |
| ------------- | :-------- | :-------------------------------- |
| `done`        | `boolean` | **Optional**. Task pending state. |
| `description` | `string`  | **Optional**. Task details.       |

#### Failure Response

```bash
Status: 404 Not Found | 401 Unauthorized
```

#### Success Response

```bash
Status: 200 OK
```

Returns the updated task object.

### Delete Task by ID (private)

Remove a specific task using their unique database ID.

```bash
DELETE /api/v1/tasks/:id
```

#### Failure Response

```bash
Status: 404 Not Found | 401 Unauthorized
```

#### Success Response

```bash
Status: 204 No Content
```

Removes the specific task from the database.
