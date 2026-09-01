import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { sendError } from '../utils/response';
import { Role } from '@prisma/client';

/**
 * Role-Based Authorization Middleware (Section 22)
 *
 * ADMIN: Full system access across campus resources.
 * HOD: Department-level management (courses, classes, timetables).
 * FACULTY: Access to own schedule and room preferences.
 * LAB_INCHARGE: Laboratory and equipment resource management.
 * STUDENT: View-only access to approved timetables & room allocations.
 */
export const authorizeRoles = (...allowedRoles: (Role | string)[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated user', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    return next();
  };
};

/**
 * Department-level authorization guard for HODs.
 * ADMIN has global bypass; HOD is restricted to their own department.
 */
export const authorizeDepartment = (getDepartmentId: (req: AuthenticatedRequest) => string | undefined) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated user', 401);
    }

    if (req.user.role === 'ADMIN') {
      return next();
    }

    const targetDeptId = getDepartmentId(req);
    if (req.user.role === 'HOD') {
      if (!targetDeptId || req.user.departmentId === targetDeptId) {
        return next();
      }
      return sendError(res, 'Access denied. You can only manage your own department.', 403);
    }

    return sendError(res, 'Access denied. Insufficient permissions.', 403);
  };
};
