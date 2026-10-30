import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../lib/errors.js';

type Schemas = { body?: ZodType; params?: ZodType; query?: ZodType };

// Parses body, params and query. Parsed values go to res.locals.validated, because req.query is
// read-only in Express 5.
export function validate(schemas: Schemas): RequestHandler {
  return (req, res, next) => {
    const validated: Record<string, unknown> = {};
    for (const key of ['body', 'params', 'query'] as const) {
      const schema = schemas[key];
      if (!schema) continue;
      const result = schema.safeParse(req[key] ?? {});
      if (!result.success) {
        throw new ValidationError(result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })));
      }
      validated[key] = result.data;
    }
    res.locals.validated = validated;
    next();
  };
}
