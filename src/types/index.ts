// ==============================
// Core Entity Types & Enums
// ==============================

export type RoomStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'maintenance'
  | 'underutilized'
  | 'overcrowded';

export type RoomType =
  | 'classroom'
  | 'laboratory'
  | 'seminar'
  | 'lecture-hall'
  | 'computer-lab'
  | 'conference';

export type ConflictType =
  | 'Capacity Conflict'
  | 'Room-Time Conflict'
  | 'Faculty-Time Conflict'
  | 'Equipment Mismatch'
  | 'Room Type Mismatch'
  | 'Resource Unavailable';

export type ConflictSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ConflictStatus = 'open' | 'in-progress' | 'resolved';
export type FacultyStatus = 'active' | 'on-leave' | 'part-time';
export type NotificationPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Equipment {
  id: string;
  name: string;
  count: number;
  status: 'working' | 'faulty' | 'missing';
}

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: RoomType;
  status: RoomStatus;
  utilization: number; // 0-100
  equipment: Equipment[];
  currentClass?: string;
  currentFaculty?: string;
  schedule: ScheduleSlot[];
  description?: string;
  amenities: string[];
}

export interface Lab extends Room {
  department: string;
  safetyRating: 'A' | 'B' | 'C';
  specialEquipment: string[];
}

export interface ScheduleSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  course: string;
  courseCode: string;
  faculty: string;
  year: number; // 1, 2, 3, 4
  division: string; // 'Div A', 'Div B', 'Div C'
  enrolled: number;
  room: string;
  isConflict?: boolean;
  conflictReason?: string;
}

export interface ClassCourse {
  id: string;
  code: string;
  subject: string;
  department: string;
  year: number; // 1, 2, 3, 4
  division: string; // 'Div A', 'Div B', 'Div C'
  students: number;
  faculty: string;
  requiredRoomType: RoomType;
  requiredEquipment: string[];
  assignedRoom: string;
  timeSlot: string;
  credits: number;
  type: 'theory' | 'practical' | 'seminar' | 'elective';
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: FacultyStatus;
  availability: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  preferredTime: string; // e.g. 'Morning (09:00 - 13:00)', 'Afternoon (13:00 - 17:00)'
  preferredBuilding: string; // e.g. 'Block A', 'Block B'
  assignedClasses: string[]; // e.g. ['CS201 (Div A)', 'CS351 (Div B)']
  workload: number; // hours per week
  maxWorkload: number;
  phone: string;
  specialization: string[];
  potentialConflicts: string[];
  schedule: ScheduleSlot[];
}

export interface DetailedConflict {
  id: string;
  category: ConflictType;
  severity: ConflictSeverity;
  status: ConflictStatus;
  course: string;
  subject: string;
  room: string;
  roomCapacity?: number;
  studentCount?: number;
  time: string;
  day: string;
  faculty?: string;
  problem: string;
  recommendedAction: string;
  affectedEntities: string[];
  detectedAt: string;
  resolvedAt?: string;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'capacity' | 'scheduling' | 'equipment' | 'utilization';
  estimatedSaving?: string;
  affectedEntities: string[];
  actionLabel: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'draft' | 'running' | 'completed';
  parameters: SimulationParameter[];
  results?: SimulationResult;
}

export interface SimulationParameter {
  key: string;
  label: string;
  value: number | string | boolean;
  type: 'number' | 'select' | 'toggle';
  options?: string[];
  min?: number;
  max?: number;
}

export interface SimulationResult {
  utilizationBefore: number;
  utilizationAfter: number;
  conflictsBefore: number;
  conflictsAfter: number;
  savingsBefore: string;
  savingsAfter: string;
  recommendations: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  type: 'conflict' | 'system' | 'optimization' | 'schedule' | 'maintenance';
  read: boolean;
  createdAt: string;
  actionLabel?: string;
  actionRoute?: string;
}

export interface KPIData {
  totalRooms: number;
  totalLabs: number;
  activeConflicts: number;
  underutilizedResources: number;
  campusUtilization: number;
  resolvedConflicts: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondary?: number;
  tertiary?: number;
}

export interface TimeSeriesPoint {
  time: string;
  rooms: number;
  labs: number;
  halls: number;
}

// ==============================
// Authentication & User Roles
// ==============================
export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}
