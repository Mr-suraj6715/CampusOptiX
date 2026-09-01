import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  details?: any[];
  meta?: Record<string, any>;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: Record<string, any>
) => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  return res.status(statusCode).json(payload);
};

/**
 * Centralized Error Response (Section 48)
 *
 * Guaranteed format:
 * {
 *   "success": false,
 *   "message": "...",
 *   "errorCode": "...",
 *   "details": []
 * }
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errorCode?: string,
  details: any[] = []
) => {
  const code =
    errorCode ||
    (statusCode === 400
      ? 'BAD_REQUEST'
      : statusCode === 401
      ? 'UNAUTHORIZED'
      : statusCode === 403
      ? 'FORBIDDEN'
      : statusCode === 404
      ? 'NOT_FOUND'
      : statusCode === 409
      ? 'CONFLICT'
      : statusCode === 422
      ? 'VALIDATION_ERROR'
      : 'INTERNAL_SERVER_ERROR');

  const payload: ApiResponse = {
    success: false,
    message,
    errorCode: code,
    details: Array.isArray(details) ? details : [details],
  };
  return res.status(statusCode).json(payload);
};
