import { z } from 'zod';
import { roomTypeEnum } from './room.schema';

export const createCourseSchema = z.object({
  courseCode: z.string().min(1, 'Course code is required'),
  name: z.string().min(1, 'Course name is required'),
  departmentId: z.string().min(1, 'Department ID is required'),
  credits: z.number().int().min(1).max(10).default(4),
  requiredRoomType: roomTypeEnum.default('CLASSROOM'),
  requiredStudentCapacity: z.number().int().min(1).default(40),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createClassSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  departmentId: z.string().min(1, 'Department ID is required'),
  year: z.number().int().min(1).max(5),
  division: z.string().min(1, 'Division is required'),
  studentCount: z.number().int().min(1, 'Student count must be at least 1'),
  facultyId: z.string().optional(),
  requiredRoomType: roomTypeEnum.default('CLASSROOM'),
  priority: z.number().int().min(1).max(5).default(3),
  requiredEquipment: z.array(z.string()).default([]),
  assignedRoomId: z.string().optional(),
});

export const updateClassSchema = createClassSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
