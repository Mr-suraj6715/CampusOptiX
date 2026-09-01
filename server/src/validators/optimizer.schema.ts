import { z } from 'zod';

export const recommendationWeightsSchema = z.object({
  capacity: z.number().min(0).max(100).optional(),
  equipment: z.number().min(0).max(100).optional(),
  availability: z.number().min(0).max(100).optional(),
  roomType: z.number().min(0).max(100).optional(),
  utilization: z.number().min(0).max(100).optional(),
  facultyPreference: z.number().min(0).max(100).optional(),
  studentTravel: z.number().min(0).max(100).optional(),
});

export const recommendationRequestSchema = z.object({
  conflictId: z.string().min(1, 'Conflict ID is required'),
  weights: recommendationWeightsSchema.optional(),
});

export const underutilizationScanSchema = z.object({
  threshold: z.number().min(1).max(100).default(50.0).optional(),
  autoUpdateStatus: z.boolean().default(false).optional(),
});

export const emergencyReallocationSchema = z.object({
  resourceId: z.string().min(1, 'Resource ID is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().optional(),
});

export const runSimulationSchema = z.object({
  scenarioType: z.enum([
    'ROOM_UNAVAILABLE',
    'ADDITIONAL_STUDENTS',
    'FACULTY_UNAVAILABLE',
    'NEW_CLASS',
    'CUSTOM',
  ]).default('ROOM_UNAVAILABLE'),
  resource: z.string().optional(),
  roomId: z.string().optional(),
  scenarioData: z.record(z.any()).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  additionalCount: z.number().int().optional(),
  studentSurge: z.number().int().optional(),
  facultyId: z.string().optional(),
  newCourseName: z.string().optional(),
  customParameters: z.record(z.any()).optional(),
});

export const approveRecommendationSchema = z.object({
  recommendationId: z.string().optional(),
  approvedBy: z.string().default('Campus Administrator').optional(),
});

export const createNotificationSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['INFO', 'WARNING', 'CRITICAL', 'ROOM_CHANGE', 'CONFLICT', 'OPTIMIZATION']).default('INFO'),
});

export const recordAttendanceSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  date: z.string().datetime().optional().or(z.string().optional()),
  scheduledStudents: z.number().int().min(1, 'Scheduled students count is required'),
  presentStudents: z.number().int().min(0, 'Present students count cannot be negative'),
});

export const triggerOptimizationRunSchema = z.object({
  trigger: z.enum(['MANUAL', 'AUTOMATIC', 'EMERGENCY', 'SIMULATION']).default('MANUAL'),
});

// Section 55: Natural Language Query Schema
export const nlQuerySchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters long'),
});

export type RecommendationRequestInput = z.infer<typeof recommendationRequestSchema>;
export type EmergencyReallocationInput = z.infer<typeof emergencyReallocationSchema>;
export type UnderutilizationScanInput = z.infer<typeof underutilizationScanSchema>;
export type RunSimulationInput = z.infer<typeof runSimulationSchema>;
export type ApproveRecommendationInput = z.infer<typeof approveRecommendationSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type RecordAttendanceInput = z.infer<typeof recordAttendanceSchema>;
export type TriggerOptimizationRunInput = z.infer<typeof triggerOptimizationRunSchema>;
export type NlQueryInput = z.infer<typeof nlQuerySchema>;
