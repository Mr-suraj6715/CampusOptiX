import { z } from 'zod';

export const createClassSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  departmentId: z.string().min(1, 'Department ID is required'),
  year: z.number().int().min(1).max(4),
  division: z.string().min(1, 'Division is required'),
  studentCount: z.number().int().min(1, 'Student count must be at least 1'),
  facultyId: z.string().optional(),
  requiredRoomType: z.enum([
    'CLASSROOM',
    'COMPUTER_LAB',
    'SCIENCE_LAB',
    'SEMINAR_HALL',
    'AUDITORIUM',
    'WORKSHOP',
    'MEETING_ROOM',
    'OTHER',
  ]),
  priority: z.number().int().min(1).max(5).default(3),
  requiredEquipment: z.array(z.string()).default([]),
  assignedRoomId: z.string().optional(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
