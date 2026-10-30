import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, NotFoundError } from '../lib/errors.js';

export const notFound: RequestHandler = (req) => {
  throw new NotFoundError(`Route ${req.method} ${req.path} not found`);
};

// Registered last. One response shape for every error; unknown errors are logged and hidden.
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = String(req.id);
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details, requestId } });
    return;
  }
  // express.json() errors: malformed JSON (400) or a body over the limit (413).
  if (typeof err?.status === 'number' && err.status >= 400 && err.status < 500) {
    const code = err.status === 413 ? 'PAYLOAD_TOO_LARGE' : 'BAD_REQUEST';
    res.status(err.status).json({ error: { code, message: 'Invalid request body', requestId } });
    return;
  }
  req.log.error({ err }, 'unhandled error');
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong', requestId } });
};
