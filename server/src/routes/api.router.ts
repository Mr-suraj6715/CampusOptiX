import { Router } from 'express';
import { authController, roomController, labController } from '../controllers/auth.controller';
import {
  classController,
  courseController,
  facultyController,
  timetableController,
  conflictController,
  optimizerController,
  simulationController,
  analyticsController,
  notificationController,
  attendanceController,
  aiController,
} from '../controllers/class.controller';
import { docsController } from '../docs/openapi';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.schema';
import {
  createRoomSchema,
  updateRoomSchema,
  updateRoomStatusSchema,
  createLabSchema,
  updateLabSchema,
} from '../validators/room.schema';
import {
  createCourseSchema,
  updateCourseSchema,
  createClassSchema,
  updateClassSchema,
} from '../validators/course.schema';
import {
  createFacultySchema,
  updateFacultySchema,
} from '../validators/faculty.schema';
import {
  createTimetableSlotSchema,
  updateTimetableSlotSchema,
} from '../validators/timetable.schema';
import {
  runSimulationSchema,
  approveRecommendationSchema,
  createNotificationSchema,
  recordAttendanceSchema,
  triggerOptimizationRunSchema,
  recommendationRequestSchema,
  emergencyReallocationSchema,
  nlQuerySchema,
} from '../validators/optimizer.schema';

const router = Router();

// ==================================================
// Section 47: OpenAPI / Swagger Documentation Endpoints
// ==================================================
router.get('/docs/openapi.json', docsController.getOpenApiSpec);
router.get('/docs', docsController.getSwaggerUI);

// ==================================================
// Section 44: Main Dashboard KPI Endpoint
// ==================================================
router.get('/dashboard', analyticsController.getDashboard);

// ==================================================
// Section 21 & 51: Authentication Routes (JWT / Password Sanitization)
// ==================================================
router.post('/auth/register', validateRequest(registerSchema), authController.register);
router.post('/auth/login', validateRequest(loginSchema), authController.login);
router.get('/auth/me', authenticate, authController.getMe);

// ==================================================
// Section 23: Room APIs
// ==================================================
router.get('/rooms', roomController.listRooms);
router.get('/rooms/:id', roomController.getRoomById);
router.post(
  '/rooms',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createRoomSchema),
  roomController.createRoom
);
router.put(
  '/rooms/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD', 'LAB_INCHARGE'),
  validateRequest(updateRoomSchema),
  roomController.updateRoom
);
router.delete(
  '/rooms/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  roomController.deleteRoom
);
router.patch(
  '/rooms/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'HOD', 'LAB_INCHARGE'),
  validateRequest(updateRoomStatusSchema),
  roomController.updateRoomStatus
);

// ==================================================
// Section 24: Lab APIs
// ==================================================
router.get('/labs', labController.listLabs);
router.get('/labs/:id', labController.getLabById);
router.post(
  '/labs',
  authenticate,
  authorizeRoles('ADMIN', 'LAB_INCHARGE'),
  validateRequest(createLabSchema),
  labController.createLab
);
router.put(
  '/labs/:id',
  authenticate,
  authorizeRoles('ADMIN', 'LAB_INCHARGE'),
  validateRequest(updateLabSchema),
  labController.updateLab
);
router.delete(
  '/labs/:id',
  authenticate,
  authorizeRoles('ADMIN', 'LAB_INCHARGE'),
  labController.deleteLab
);

// ==================================================
// Section 25: Course & Class APIs
// ==================================================
router.get('/courses', courseController.listCourses);
router.get('/courses/:id', courseController.getCourseById);
router.post(
  '/courses',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(createCourseSchema),
  courseController.createCourse
);
router.put(
  '/courses/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(updateCourseSchema),
  courseController.updateCourse
);
router.delete(
  '/courses/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  courseController.deleteCourse
);

router.get('/classes', classController.listClasses);
router.get('/classes/:id', classController.getClassById);
router.post(
  '/classes',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(createClassSchema),
  classController.createClass
);
router.put(
  '/classes/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(updateClassSchema),
  classController.updateClass
);
router.delete(
  '/classes/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  classController.deleteClass
);

// ==================================================
// Section 26: Faculty APIs
// ==================================================
router.get('/faculty', facultyController.listFaculty);
router.get('/faculty/:id', facultyController.getFacultyById);
router.post(
  '/faculty',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(createFacultySchema),
  facultyController.createFaculty
);
router.put(
  '/faculty/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD', 'FACULTY'),
  validateRequest(updateFacultySchema),
  facultyController.updateFaculty
);
router.delete(
  '/faculty/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  facultyController.deleteFaculty
);

// ==================================================
// Section 27: Timetable APIs
// ==================================================
router.get('/timetable', timetableController.listSlots);
router.get('/timetables', timetableController.listSlots);
router.get('/timetable/:id', timetableController.getSlotById);
router.get('/timetables/:id', timetableController.getSlotById);
router.post(
  '/timetable',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(createTimetableSlotSchema),
  timetableController.bookSlot
);
router.post(
  '/timetables',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(createTimetableSlotSchema),
  timetableController.bookSlot
);
router.put(
  '/timetable/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(updateTimetableSlotSchema),
  timetableController.updateSlot
);
router.put(
  '/timetables/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(updateTimetableSlotSchema),
  timetableController.updateSlot
);
router.delete(
  '/timetable/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  timetableController.deleteSlot
);
router.delete(
  '/timetables/:id',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  timetableController.deleteSlot
);

// ==================================================
// Sections 14, 28: Conflict Detection Engine
// ==================================================
router.get('/conflicts', conflictController.listConflicts);
router.get('/conflicts/:id', conflictController.getConflictById);
router.post(
  '/conflicts/detect',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  conflictController.triggerScan
);

// ==================================================
// Sections 15, 29, 30, 31, 32, 33, 34, 38, 39, 40, 53: AI Optimizer & Candidates
// ==================================================
// Section 31: Candidate Room Search
router.get('/optimizer/conflicts/:conflictId/candidates', optimizerController.getCandidates);

// Section 32, 33, 34: Recommendation Generation with Structured Explanation & Before vs After
router.post(
  '/optimizer/recommend',
  validateRequest(recommendationRequestSchema),
  optimizerController.generateRecommendation
);

router.get('/optimizer/recommendations', optimizerController.getSolutions);
router.post(
  '/optimizer/approve',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(approveRecommendationSchema),
  optimizerController.approveAllocation
);

// Section 35: Transaction-Safe Approval & Rejection APIs
router.post(
  '/recommendations/:id/approve',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  optimizerController.approveRecommendationById
);
router.post(
  '/recommendations/:id/reject',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  optimizerController.rejectRecommendationById
);

// Section 36: Emergency Reallocation
router.post(
  '/optimizer/emergency',
  authenticate,
  authorizeRoles('ADMIN', 'HOD', 'LAB_INCHARGE'),
  validateRequest(emergencyReallocationSchema),
  optimizerController.runEmergencyReallocation
);

// Section 29: Underutilization Engine
router.get('/optimizer/underutilized', optimizerController.getUnderutilized);

// Sections 16 & 17: Optimization Runs
router.get('/optimizer/runs', optimizerController.listRuns);
router.get('/optimizer/runs/:id', optimizerController.getRunById);
router.post(
  '/optimizer/run',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(triggerOptimizationRunSchema),
  optimizerController.triggerRun
);

// Section 43: Optimization History (supports /optimization/history and /history)
router.get('/optimization/history', optimizerController.getHistory);
router.get('/history', optimizerController.getHistory);

// ==================================================
// Section 18 & 42: Notification Routes
// ==================================================
router.get('/notifications', authenticate, notificationController.listNotifications);
router.post(
  '/notifications',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(createNotificationSchema),
  notificationController.createNotification
);
router.patch('/notifications/:id/read', authenticate, notificationController.markAsRead);
router.post('/notifications/read-all', authenticate, notificationController.markAllAsRead);

// ==================================================
// Section 19 & 54: Attendance & Demand Analytics Routes
// ==================================================
router.get('/attendance', attendanceController.listAttendance);
router.post(
  '/attendance',
  authenticate,
  authorizeRoles('ADMIN', 'HOD', 'FACULTY'),
  validateRequest(recordAttendanceSchema),
  attendanceController.recordAttendance
);
router.get('/attendance/analytics', attendanceController.getDemandAnalytics);
router.get('/attendance/prediction', attendanceController.getPrediction);

// ==================================================
// Section 20 & 37: What-If Simulation Engine Routes
// ==================================================
router.get('/simulation', simulationController.listSimulations);
router.get('/simulation/:id', simulationController.getSimulationById);
router.post(
  '/simulation/run',
  authenticate,
  authorizeRoles('ADMIN', 'HOD'),
  validateRequest(runSimulationSchema),
  simulationController.runSimulation
);

// ==================================================
// Section 41: Analytics Endpoints
// ==================================================
router.get('/analytics/overview', analyticsController.getOverview);
router.get('/analytics/utilization', analyticsController.getUtilization);
router.get('/analytics/conflicts', analyticsController.getConflicts);
router.get('/analytics/optimization', analyticsController.getOptimization);
router.get('/analytics/metrics', analyticsController.getMetrics);

// ==================================================
// Section 55: Optional Natural Language Query AI Layer
// ==================================================
router.post('/ai/query', validateRequest(nlQuerySchema), aiController.handleNlQuery);

export default router;
