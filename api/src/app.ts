import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { todosRouter } from './modules/todos/todos.routes.js';

// Builds the app without listening, so tests can import it.
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json({ limit: '100kb' }));
  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const incoming = req.headers['x-request-id'];
        const id = typeof incoming === 'string' && incoming.length <= 100 ? incoming : randomUUID();
        res.setHeader('x-request-id', id);
        return id;
      },
    }),
  );

  app.get('/healthz', (_req, res) => {
    res.json({ data: { status: 'ok' } });
  });
  app.get('/readyz', (_req, res) => {
    res.json({ data: { status: 'ready' } }); // no database or other dependencies yet
  });

  app.use('/api/v1/todos', todosRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
