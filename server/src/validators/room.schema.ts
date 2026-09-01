import { z } from 'zod';

export const roomTypeEnum = z.enum([
  'CLASSROOM',
  'COMPUTER_LAB',
  'SCIENCE_LAB',
  'SEMINAR_HALL',
  'AUDITORIUM',
  'WORKSHOP',
  'MEETING_ROOM',
  'OTHER',
]);

export const roomStatusEnum = z.enum([
  'AVAILABLE',
  'OCCUPIED',
  'RESERVED',
  'MAINTENANCE',
  'UNDERUTILIZED',
  'OVERCROWDED',
]);

export const createRoomSchema = z.object({
  roomCode: z.string().min(1, 'Room Code is required'),
  name: z.string().min(1, 'Room name is required'),
  buildingId: z.string().min(1, 'Building ID is required'),
  floor: z.number().int().min(0).max(20),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  type: roomTypeEnum.default('CLASSROOM'),
  status: roomStatusEnum.default('AVAILABLE'),
  utilizationThreshold: z.number().min(0).max(100).default(40.0),
  amenities: z.array(z.string()).default([]),
  description: z.string().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const updateRoomStatusSchema = z.object({
  status: roomStatusEnum,
  reason: z.string().optional(),
});

export const createLabSchema = z.object({
  roomCode: z.string().min(1, 'Lab Code is required'),
  name: z.string().min(1, 'Lab name is required'),
  buildingId: z.string().min(1, 'Building ID is required'),
  floor: z.number().int().min(0).max(20),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  type: z.enum(['COMPUTER_LAB', 'SCIENCE_LAB', 'WORKSHOP']).default('COMPUTER_LAB'),
  status: roomStatusEnum.default('AVAILABLE'),
  utilizationThreshold: z.number().min(0).max(100).default(40.0),
  amenities: z.array(z.string()).default([]),
  description: z.string().optional(),
  equipmentIds: z.array(z.string()).optional(),
});

export const updateLabSchema = createLabSchema.partial();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type UpdateRoomStatusInput = z.infer<typeof updateRoomStatusSchema>;
export type CreateLabInput = z.infer<typeof createLabSchema>;
export type UpdateLabInput = z.infer<typeof updateLabSchema>;
