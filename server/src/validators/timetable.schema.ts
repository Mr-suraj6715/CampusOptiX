import { z } from 'zod';
import { dayOfWeekEnum } from './faculty.schema';

export const timetableStatusEnum = z.enum([
  'SCHEDULED',
  'ACTIVE',
  'CANCELLED',
  'CONFLICT',
]);

export const createTimetableSlotSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  roomId: z.string().min(1, 'Room ID is required'),
  facultyId: z.string().optional(),
  dayOfWeek: dayOfWeekEnum,
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM'),
  status: timetableStatusEnum.default('SCHEDULED'),
});

export const updateTimetableSlotSchema = createTimetableSlotSchema.partial();

export const timetableFilterSchema = z.object({
  department: z.string().optional(),
  faculty: z.string().optional(),
  room: z.string().optional(),
  year: z.string().or(z.number()).optional(),
  division: z.string().optional(),
  day: dayOfWeekEnum.optional(),
  status: timetableStatusEnum.optional(),
});

export type CreateTimetableSlotInput = z.infer<typeof createTimetableSlotSchema>;
export type UpdateTimetableSlotInput = z.infer<typeof updateTimetableSlotSchema>;
export type TimetableFilterInput = z.infer<typeof timetableFilterSchema>;
