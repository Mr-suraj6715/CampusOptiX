import {
  mockRooms,
  mockLabs,
  mockClassesList,
  mockFacultyList,
  mockDetailedConflicts,
  mockRecommendations,
  mockKPIData,
} from '@/data/mockData';
import type {
  Room,
  Lab,
  ClassCourse,
  Faculty,
  DetailedConflict,
  OptimizationRecommendation,
  KPIData,
} from '@/types';

// Simulated network latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * CampusOptiX Frontend Mock API Layer
 * Cleanly separates UI components from data fetching logic.
 * Ready for seamless backend REST / GraphQL integration.
 */
export const campusApi = {
  // 1. Get KPI Stats
  async getKpis(): Promise<KPIData> {
    await delay(120);
    return { ...mockKPIData };
  },

  // 2. Get Rooms
  async getRooms(): Promise<Room[]> {
    await delay(150);
    return [...mockRooms];
  },

  // 3. Get Laboratories
  async getLabs(): Promise<Lab[]> {
    await delay(120);
    return [...mockLabs];
  },

  // 4. Get Classes
  async getClasses(): Promise<ClassCourse[]> {
    await delay(140);
    return [...mockClassesList];
  },

  // 5. Get Faculty
  async getFaculty(): Promise<Faculty[]> {
    await delay(130);
    return [...mockFacultyList];
  },

  // 6. Get Timetable
  async getTimetable() {
    await delay(150);
    return mockRooms.flatMap((r) => r.schedule);
  },

  // 7. Get Conflicts
  async getConflicts(): Promise<DetailedConflict[]> {
    await delay(120);
    return [...mockDetailedConflicts];
  },

  // 8. Get Recommendations
  async getRecommendations(): Promise<OptimizationRecommendation[]> {
    await delay(100);
    return [...mockRecommendations];
  },

  // 9. Run Optimization Solver
  async runOptimization(conflictId: string) {
    await delay(600);
    return {
      success: true,
      conflictId,
      proposedMove: 'MOVE DBMS LAB → LAB A',
      score: 94,
      timestamp: new Date().toISOString(),
    };
  },

  // 10. Run What-If Simulation
  async runSimulation(payload: { eventType: string; resource: string }) {
    await delay(500);
    return {
      success: true,
      payload,
      newConflicts: 2,
      projectedUtilization: 76,
      timestamp: new Date().toISOString(),
    };
  },

  // 11. Approve Recommendation
  async approveRecommendation(recommendationId: string) {
    await delay(300);
    return {
      success: true,
      recommendationId,
      status: 'Applied',
      updatedTimetableSlot: {
        course: 'CS351 - DBMS Lab',
        newRoom: 'Lab A',
        day: 'Tuesday',
        time: '14:00 - 16:00 (2:00 PM)',
      },
    };
  },
};

// Standalone function exports for Section 27 compliance
export const getRooms = campusApi.getRooms;
export const getLabs = campusApi.getLabs;
export const getClasses = campusApi.getClasses;
export const getFaculty = campusApi.getFaculty;
export const getTimetable = campusApi.getTimetable;
export const getConflicts = campusApi.getConflicts;
export const getRecommendations = campusApi.getRecommendations;
export const runOptimization = campusApi.runOptimization;
export const runSimulation = campusApi.runSimulation;
export const approveRecommendation = campusApi.approveRecommendation;

export default campusApi;
