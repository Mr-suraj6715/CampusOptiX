import { Request, Response } from 'express';
import { authService, roomService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, 'Registration successful', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      return sendError(res, error.message, 401);
    }
  },

  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) return sendError(res, 'Unauthorized', 401);
      const user = await authService.getMe(req.user.userId);
      return sendSuccess(res, user);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },
};

export const roomController = {
  async listRooms(req: Request, res: Response) {
    try {
      const { building, buildingId, floor, type, status, capacity, minCapacity, availability, search } = req.query;
      const rooms = await roomService.listRooms({
        building: (building || buildingId) as string,
        buildingId: buildingId as string,
        floor: floor ? Number(floor) : undefined,
        type: type as any,
        status: status as any,
        capacity: capacity ? Number(capacity) : undefined,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
        availability: availability as any,
        search: search as string,
      });
      return sendSuccess(res, rooms);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getRoomById(req: Request, res: Response) {
    try {
      const room = await roomService.getRoomById(req.params.id);
      return sendSuccess(res, room);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async createRoom(req: Request, res: Response) {
    try {
      const room = await roomService.createRoom(req.body);
      return sendSuccess(res, room, 'Room created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async updateRoom(req: Request, res: Response) {
    try {
      const room = await roomService.updateRoom(req.params.id, req.body);
      return sendSuccess(res, room, 'Room updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async deleteRoom(req: Request, res: Response) {
    try {
      await roomService.deleteRoom(req.params.id);
      return sendSuccess(res, null, 'Room deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async updateRoomStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const updated = await roomService.updateRoomStatus(req.params.id, status);
      return sendSuccess(res, updated, 'Room status updated');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },
};

export const labController = {
  async listLabs(req: Request, res: Response) {
    try {
      const { building, buildingId, floor, status, minCapacity, search } = req.query;
      const labs = await roomService.listLabs({
        building: (building || buildingId) as string,
        buildingId: buildingId as string,
        floor: floor ? Number(floor) : undefined,
        status: status as any,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
        search: search as string,
      });
      return sendSuccess(res, labs);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getLabById(req: Request, res: Response) {
    try {
      const lab = await roomService.getLabById(req.params.id);
      return sendSuccess(res, lab);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async createLab(req: Request, res: Response) {
    try {
      const lab = await roomService.createLab(req.body);
      return sendSuccess(res, lab, 'Lab created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async updateLab(req: Request, res: Response) {
    try {
      const lab = await roomService.updateLab(req.params.id, req.body);
      return sendSuccess(res, lab, 'Lab updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async deleteLab(req: Request, res: Response) {
    try {
      await roomService.deleteLab(req.params.id);
      return sendSuccess(res, null, 'Lab deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },
};
