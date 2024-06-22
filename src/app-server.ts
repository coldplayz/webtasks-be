import { createServer } from 'node:http';
import express from 'express';

/**
 * Server instances
 */

const PORT: number = parseInt(process.env.PORT as string, 10) || 3456;

export const app = express();
export const server = createServer(app);
