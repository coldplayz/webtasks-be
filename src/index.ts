/**
 * External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
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

dotenv.config();

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

app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);

// Sanity check
app.get("/", (_, res) => {
  res.json({ success: true, data: 'LIVE' })
  eventEmitter.emit('apiEvent', 'sanity check successfull!');
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
