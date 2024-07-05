/**
 * External Modules
 */

import * as dotenv from "dotenv";

const result = dotenv.config({ path: ['./.env', './.env.local'] });
if (result.error) {
  throw result.error
}

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import logger from "morgan";

import { server, app } from "../src/app-server";
import eventEmitter from "../src/events/api-events";
import connectDB from "@/src/connection";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import taskRouter from "./routes/task.route";
import { DATABASE_NAME } from "@/lib/config";
import { ApiError } from "@/lib/error-handling";

/**
 * Server and socket setup
 */

const PORT: number = parseInt(process.env.PORT as string, 10) || 3456;

// const app = express();
// const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}, // in-memory state for clients
  cors: {
    origin: "*", // insecure; for development/testing only
  }
});

// const ee = new EventEmitter();

/**
 *  Configuration and middlewares
 */

// Sanity check
app.get("/", (_, res) => {
  res.json({ success: true, data: 'LIVE' })
  eventEmitter.emit('apiEvent', 'sanity check successfull!');
});

app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);

// Catch-all error handler
app.use((
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err)
  }

  let statusCode = 500;

  if (err instanceof ApiError) statusCode = err.statusCode;

  switch (err.constructor.name) {
    case 'CastError':
      // invalid ObjectId string
      return res.status(400).json({ success: false, error: err });
    case 'MongoServerError':
      // duplicate key error
      return res.status(403).json({ success: false, error: err });
    case 'ValidationError':
      return res.status(400).json({ success: false, error: err });
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      name: err.constructor.name, // then put in switch stmt
      err,
    }
  });
});

// Handle 404, which is not considered an error
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}. Resource not found.`,
  });
});

// Socket

/**
 * Server and socket startup
 */
connectDB(DATABASE_NAME)
  .then(() => {
    server.listen(PORT, () => {
      eventEmitter.on('apiEvent', (msg) => {
        io.emit('apiEvent', msg);
      });

      eventEmitter.on('createUser', (msg) => {
        io.emit('createUser', msg);
      });

      eventEmitter.on('getUsers', (msg) => {
        io.emit('getUsers', msg);
      });

      eventEmitter.on('getUserById', (msg) => {
        io.emit('getUserById', msg);
      });

      eventEmitter.on('editUserById', (msg) => {
        io.emit('editUserById', msg);
      });

      eventEmitter.on('deleteUserById', (msg) => {
        io.emit('deleteUserById', msg);
      });

      eventEmitter.on('createTask', (msg) => {
        io.emit('createTask', msg);
      });

      eventEmitter.on('getTasks', (msg) => {
        io.emit('getTasks', msg);
      });

      eventEmitter.on('getTaskById', (msg) => {
        io.emit('getTaskById', msg);
      });

      eventEmitter.on('editTaskById', (msg) => {
        io.emit('editTaskById', msg);
      });

      eventEmitter.on('deleteTaskById', (msg) => {
        io.emit('deleteTaskById', msg);
      });

      eventEmitter.on('loginUser', (msg) => {
        io.emit('loginUser', msg);
      });

      eventEmitter.on('logoutUser', (msg) => {
        io.emit('logoutUser', msg);
      });

      eventEmitter.on('refreshToken', (msg) => {
        io.emit('refreshToken', msg);
      });

      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(console.log);
