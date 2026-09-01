import { Request, Response } from 'express';
import {
  classService,
  courseService,
  facultyService,
  timetableService,
  conflictService,
  optimizerService,
  notificationService,
  attendanceService,
  simulationService,
  aiService,
} from '../services/class.service';
import { simulationEngine } from '../simulation/simulator';
import { analyticsEngine } from '../analytics/analyticsEngine';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const courseController = {
  async listCourses(req: Request, res: Response) {
    try {
      const { department, departmentId, search } = req.query;
      const courses = await courseService.listCourses({
        departmentId: (departmentId || department) as string,
        search: search as string,
      });
      return sendSuccess(res, courses);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getCourseById(req: Request, res: Response) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      return sendSuccess(res, course);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async createCourse(req: Request, res: Response) {
    try {
      const course = await courseService.createCourse(req.body);
      return sendSuccess(res, course, 'Course created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async updateCourse(req: Request, res: Response) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      return sendSuccess(res, course, 'Course updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async deleteCourse(req: Request, res: Response) {
    try {
      await courseService.deleteCourse(req.params.id);
      return sendSuccess(res, null, 'Course deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },
};

export const classController = {
  async listClasses(req: Request, res: Response) {
    try {
      const { department, departmentId, courseId, facultyId, year, division, search } = req.query;
      const classes = await classService.listClasses({
        departmentId: (departmentId || department) as string,
        courseId: courseId as string,
        facultyId: facultyId as string,
        year: year ? Number(year) : undefined,
        division: division as string,
        search: search as string,
      });
      return sendSuccess(res, classes);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getClassById(req: Request, res: Response) {
    try {
      const cls = await classService.getClassById(req.params.id);
      return sendSuccess(res, cls);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async createClass(req: Request, res: Response) {
    try {
      const cls = await classService.createClass(req.body);
      return sendSuccess(res, cls, 'Class created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async updateClass(req: Request, res: Response) {
    try {
      const cls = await classService.updateClass(req.params.id, req.body);
      return sendSuccess(res, cls, 'Class updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async deleteClass(req: Request, res: Response) {
    try {
      await classService.deleteClass(req.params.id);
      return sendSuccess(res, null, 'Class deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },
};

export const facultyController = {
  async listFaculty(req: Request, res: Response) {
    try {
      const { department, departmentId, designation, search } = req.query;
      const faculty = await facultyService.listFaculty({
        departmentId: (departmentId || department) as string,
        designation: designation as string,
        search: search as string,
      });
      return sendSuccess(res, faculty);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getFacultyById(req: Request, res: Response) {
    try {
      const faculty = await facultyService.getFacultyById(req.params.id);
      return sendSuccess(res, faculty);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async createFaculty(req: Request, res: Response) {
    try {
      const faculty = await facultyService.createFaculty(req.body);
      return sendSuccess(res, faculty, 'Faculty profile created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async updateFaculty(req: Request, res: Response) {
    try {
      const faculty = await facultyService.updateFaculty(req.params.id, req.body);
      return sendSuccess(res, faculty, 'Faculty profile updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async deleteFaculty(req: Request, res: Response) {
    try {
      await facultyService.deleteFaculty(req.params.id);
      return sendSuccess(res, null, 'Faculty profile deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },
};

export const timetableController = {
  async listSlots(req: Request, res: Response) {
    try {
      const { department, faculty, room, year, division, day, dayOfWeek, status } = req.query;
      const slots = await timetableService.listSlots({
        department: department as string,
        faculty: faculty as string,
        room: room as string,
        year: year ? Number(year) : undefined,
        division: division as string,
        day: (day || dayOfWeek) as any,
        status: status as any,
      });
      return sendSuccess(res, slots);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getSlotById(req: Request, res: Response) {
    try {
      const slot = await timetableService.getSlotById(req.params.id);
      return sendSuccess(res, slot);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async bookSlot(req: Request, res: Response) {
    try {
      const slot = await timetableService.bookSlot(req.body);
      return sendSuccess(res, slot, 'Slot booked successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async updateSlot(req: Request, res: Response) {
    try {
      const slot = await timetableService.updateSlot(req.params.id, req.body);
      return sendSuccess(res, slot, 'Slot updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async deleteSlot(req: Request, res: Response) {
    try {
      await timetableService.deleteSlot(req.params.id);
      return sendSuccess(res, null, 'Timetable slot deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },
};

export const conflictController = {
  async listConflicts(req: Request, res: Response) {
    try {
      const conflicts = await conflictService.listConflicts(req.query);
      return sendSuccess(res, conflicts);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getConflictById(req: Request, res: Response) {
    try {
      const conflict = await conflictService.getConflictById(req.params.id);
      return sendSuccess(res, conflict);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async triggerScan(req: Request, res: Response) {
    try {
      const result = await conflictService.runDetectionScan();
      return sendSuccess(res, result, 'Campus conflict scan completed');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },
};

export const optimizerController = {
  // Section 31: GET /api/optimizer/conflicts/:conflictId/candidates
  async getCandidates(req: Request, res: Response) {
    try {
      const { conflictId } = req.params;
      const candidates = await optimizerService.getCandidates(conflictId, req.query);
      return sendSuccess(res, candidates);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 32 & 33: POST /api/optimizer/recommend
  async generateRecommendation(req: Request, res: Response) {
    try {
      const { conflictId, weights } = req.body;
      if (!conflictId) return sendError(res, 'conflictId is required', 400);
      const recommendation = await optimizerService.getSolutionsForConflict(conflictId, weights);
      return sendSuccess(res, recommendation, 'Recommendation generated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 35: POST /api/recommendations/:id/approve
  async approveRecommendationById(req: AuthenticatedRequest, res: Response) {
    try {
      const recommendationId = req.params.id || req.body.recommendationId;
      const signer = req.body.approvedBy || req.user?.email || 'Campus Administrator';
      const result = await optimizerService.approveAllocation(recommendationId, signer);
      return sendSuccess(res, result, 'Official room reallocation approved and committed to master timetable');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  // Section 35: POST /api/recommendations/:id/reject
  async rejectRecommendationById(req: AuthenticatedRequest, res: Response) {
    try {
      const recommendationId = req.params.id || req.body.recommendationId;
      const result = await optimizerService.rejectAllocation(recommendationId);
      return sendSuccess(res, result, 'Recommendation rejected');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  // Section 36: POST /api/optimizer/emergency
  async runEmergencyReallocation(req: Request, res: Response) {
    try {
      const result = await optimizerService.runEmergency(req.body);
      return sendSuccess(res, result, 'Emergency reallocation plan generated');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getSolutions(req: Request, res: Response) {
    try {
      const { conflictId } = req.query;
      if (!conflictId) return sendError(res, 'conflictId is required', 400);
      const solution = await optimizerService.getSolutionsForConflict(conflictId as string);
      return sendSuccess(res, solution);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async approveAllocation(req: AuthenticatedRequest, res: Response) {
    try {
      const { recommendationId, approvedBy } = req.body;
      const signer = approvedBy || req.user?.email || 'Campus Administrator';
      const result = await optimizerService.approveAllocation(recommendationId, signer);
      return sendSuccess(res, result, 'Allocation change approved & applied');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  // Section 43: GET /api/optimization/history & GET /api/history
  async getHistory(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const history = await optimizerService.listHistory(limit);
      return sendSuccess(res, history);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async listRuns(req: Request, res: Response) {
    try {
      const runs = await optimizerService.listRuns(req.query);
      return sendSuccess(res, runs);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getRunById(req: Request, res: Response) {
    try {
      const run = await optimizerService.getRunById(req.params.id);
      return sendSuccess(res, run);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async triggerRun(req: Request, res: Response) {
    try {
      const { trigger } = req.body;
      const run = await optimizerService.startRun(trigger);
      return sendSuccess(res, run, 'Optimization run initiated', 201);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 29: GET /api/optimizer/underutilized
  async getUnderutilized(req: Request, res: Response) {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 50.0;
      const autoUpdate = req.query.autoUpdate === 'true';
      const result = await optimizerService.scanUnderutilization(threshold, autoUpdate);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },
};

export const notificationController = {
  // Section 42: GET /api/notifications
  async listNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
      const notifications = await notificationService.listNotifications(req.user?.userId, isRead);
      return sendSuccess(res, notifications);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 42: POST /api/notifications
  async createNotification(req: Request, res: Response) {
    try {
      const notif = await notificationService.createNotification(req.body);
      return sendSuccess(res, notif, 'Notification created', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  // Section 42: PATCH /api/notifications/:id/read
  async markAsRead(req: Request, res: Response) {
    try {
      const notif = await notificationService.markAsRead(req.params.id);
      return sendSuccess(res, notif, 'Notification marked as read');
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      await notificationService.markAllAsRead(req.user?.userId);
      return sendSuccess(res, null, 'All notifications marked as read');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },
};

export const attendanceController = {
  async listAttendance(req: Request, res: Response) {
    try {
      const attendance = await attendanceService.listAttendance(req.query);
      return sendSuccess(res, attendance);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async recordAttendance(req: Request, res: Response) {
    try {
      const record = await attendanceService.recordAttendance(req.body);
      return sendSuccess(res, record, 'Attendance record created', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  },

  async getDemandAnalytics(req: Request, res: Response) {
    try {
      const stats = await attendanceService.getDemandAnalytics(req.query.classId as string);
      return sendSuccess(res, stats);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 54: GET /api/attendance/prediction
  async getPrediction(req: Request, res: Response) {
    try {
      const classId = (req.query.classId as string) || 'demo-class-id';
      const scheduled = req.query.scheduled ? Number(req.query.scheduled) : undefined;
      const prediction = await attendanceService.getPrediction(classId, scheduled);
      return sendSuccess(res, prediction);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },
};

export const simulationController = {
  async listSimulations(req: Request, res: Response) {
    try {
      const simulations = await simulationService.listSimulations(req.query.createdBy as string);
      return sendSuccess(res, simulations);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getSimulationById(req: Request, res: Response) {
    try {
      const simulation = await simulationService.getSimulationById(req.params.id);
      return sendSuccess(res, simulation);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  },

  async runSimulation(req: Request, res: Response) {
    try {
      const result = await simulationEngine.runScenario(req.body);
      return sendSuccess(res, result, 'Simulation completed');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },
};

export const analyticsController = {
  // Section 44: GET /api/dashboard
  async getDashboard(req: Request, res: Response) {
    try {
      const dashboard = await analyticsEngine.getDashboard();
      return sendSuccess(res, dashboard);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 41: GET /api/analytics/overview
  async getOverview(req: Request, res: Response) {
    try {
      const overview = await analyticsEngine.getOverview();
      return sendSuccess(res, overview);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 41: GET /api/analytics/utilization
  async getUtilization(req: Request, res: Response) {
    try {
      const utilization = await analyticsEngine.getUtilizationAnalytics();
      return sendSuccess(res, utilization);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 41: GET /api/analytics/conflicts
  async getConflicts(req: Request, res: Response) {
    try {
      const conflicts = await analyticsEngine.getConflictsAnalytics();
      return sendSuccess(res, conflicts);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  // Section 41: GET /api/analytics/optimization
  async getOptimization(req: Request, res: Response) {
    try {
      const opt = await analyticsEngine.getOptimizationAnalytics();
      return sendSuccess(res, opt);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async getMetrics(req: Request, res: Response) {
    try {
      const metrics = await analyticsEngine.getOverview();
      return sendSuccess(res, metrics);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },
};

export const aiController = {
  // Section 55: POST /api/ai/query
  async handleNlQuery(req: Request, res: Response) {
    try {
      const { query } = req.body;
      const result = await aiService.handleQuery(query);
      return sendSuccess(res, result, 'Natural language query processed with deterministic verification');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },
};
