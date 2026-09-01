import { z } from 'zod';

export const dayOfWeekEnum = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]);

export const createFacultySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  facultyCode: z.string().min(1, 'Faculty code is required'),
  departmentId: z.string().min(1, 'Department ID is required'),
  designation: z.string().default('Assistant Professor'),
  phone: z.string().optional(),
  workload: z.number().int().min(0).default(0),
  maxWorkload: z.number().int().min(1).default(18),
  specialties: z.array(z.string()).default([]),
});

export const updateFacultySchema = createFacultySchema.partial();

export const createFacultyPreferenceSchema = z.object({
  preferredDay: dayOfWeekEnum.optional(),
  preferredStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  preferredEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  preferredBuildingId: z.string().optional(),
  priority: z.number().int().min(1).max(5).default(3),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
export type CreateFacultyPreferenceInput = z.infer<typeof createFacultyPreferenceSchema>;
