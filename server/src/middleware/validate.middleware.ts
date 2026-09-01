import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

/**
 * Validation Middleware (Section 49)
 * Validates request payload against Zod schema and rejects invalid requests with HTTP 422/400.
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        }));
        const summary = details.map((d) => `${d.field}: ${d.message}`).join('; ');
        return sendError(res, `Validation failed: ${summary}`, 422, 'VALIDATION_ERROR', details);
      }
      return sendError(res, 'Invalid request payload format', 400, 'BAD_REQUEST', []);
    }
  };
};

/**
 * Centralized Global Error Handler (Section 48)
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[CampusOptiX Error Handler]:', err);
  const status = err.statusCode || (err.status && typeof err.status === 'number' ? err.status : 500);
  const message = err.message || 'An unexpected server error occurred';
  const errorCode = err.errorCode || (status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'APPLICATION_ERROR');
  const details = err.details || (process.env.NODE_ENV === 'development' ? [err.stack] : []);

  return sendError(res, message, status, errorCode, details);
};
