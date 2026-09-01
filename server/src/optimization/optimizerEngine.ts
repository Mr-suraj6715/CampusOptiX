import prisma from '../config/prisma';
import { conflictRepository, recommendationRepository } from '../repositories/conflict.repository';
import { optimizationHistoryRepository } from '../repositories/history.repository';
import { optimizationRunRepository } from '../repositories/optimizationRun.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { RecommendationStatus } from '@prisma/client';

export interface WeightConfig {
  capacity: number; // default: 25
  equipment: number; // default: 20
  availability: number; // default: 20
  roomType: number; // default: 15
  utilization: number; // default: 10
  facultyPreference: number; // default: 5
  studentTravel: number; // default: 5
}

export const DEFAULT_WEIGHTS: WeightConfig = {
  capacity: 25,
  equipment: 20,
  availability: 20,
  roomType: 15,
  utilization: 10,
  facultyPreference: 5,
  studentTravel: 5,
};

export interface CandidateRoom {
  id: string;
  name: string;
  roomCode: string;
  capacity: number;
  type: string;
  status: string;
  floor: number;
  utilization: number | null;
  building: {
    id: string;
    name: string;
    code: string;
    latitude: number | null;
    longitude: number | null;
  };
  roomEquipments: Array<{ equipment: { id: string; name: string; type: string } }>;
  timetables: Array<{ dayOfWeek: string; startTime: string; endTime: string; status: string }>;
}

export interface ScoreBreakdown {
  capacity: number;
  equipment: number;
  availability: number;
  roomType: number;
  utilization: number;
  facultyPreference: number;
  studentTravel: number;
}

export interface BeforeVsAfterMetrics {
  conflictsBefore: number;
  conflictsAfter: number;
  utilizationBefore: number;
  utilizationAfter: number;
  capacityEfficiency: number;
  studentTravelDistanceMeters: number | null;
  measurableImprovement: string;
}

export interface StructuredExplanation {
  recommendation: string;
  reasons: string[];
  scoreBreakdown: ScoreBreakdown;
  beforeVsAfter?: BeforeVsAfterMetrics;
}

export interface ScoredCandidate {
  room: CandidateRoom;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
  isHardConstraintViolated: boolean;
  violatedConstraints: string[];
  travelDistanceMeters: number | null;
}

export interface RecommendationResponse {
  recommendation: string;
  recommendedRoom: CandidateRoom;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
  beforeVsAfter: BeforeVsAfterMetrics;
  alternativeRooms: ScoredCandidate[];
}

/**
 * Section 38: Student Travel Distance Calculation using Haversine formula.
 * Computes spherical distance in meters between two GPS coordinates.
 */
export function calculateHaversineDistance(
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number | null | undefined,
  lon2: number | null | undefined
): number | null {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return null;
  }
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

async function getAllCandidateRooms(): Promise<CandidateRoom[]> {
  return prisma.room.findMany({
    include: {
      building: true,
      roomEquipments: { include: { equipment: true } },
      timetables: {
        where: { status: { not: 'CANCELLED' } },
        select: { dayOfWeek: true, startTime: true, endTime: true, status: true },
      },
    },
  }) as unknown as CandidateRoom[];
}

/**
 * Section 30: Hard Constraints Evaluation
 * Hard constraint violation causes candidate rejection (score = 0).
 */
function evaluateHardConstraints(
  candidate: CandidateRoom,
  cls: {
    studentCount: number;
    requiredRoomType: string;
    requiredEquipment: string[];
    facultyId?: string | null;
  },
  slot: { dayOfWeek: string; startTime: string; endTime: string }
): { isViolated: boolean; violations: string[] } {
  const violations: string[] = [];

  // 1. Capacity sufficient
  if (candidate.capacity < cls.studentCount) {
    violations.push(`Capacity insufficient (Needs ${cls.studentCount}, candidate has ${candidate.capacity})`);
  }

  // 2. Room available
  if (candidate.status === 'MAINTENANCE' || candidate.status === 'RESERVED') {
    violations.push(`Room is unavailable (Status: ${candidate.status})`);
  }

  // 3. No room-time conflict
  const roomCollision = candidate.timetables.some(
    (t) =>
      t.dayOfWeek === slot.dayOfWeek &&
      t.startTime < slot.endTime &&
      t.endTime > slot.startTime &&
      t.status !== 'CANCELLED'
  );
  if (roomCollision) {
    violations.push(`Room time collision on ${slot.dayOfWeek} ${slot.startTime}–${slot.endTime}`);
  }

  // 4. Room type matches
  if (cls.requiredRoomType && candidate.type !== cls.requiredRoomType) {
    violations.push(`Room type mismatch (Requires ${cls.requiredRoomType}, found ${candidate.type})`);
  }

  // 5. Equipment requirements satisfied
  if (cls.requiredEquipment && cls.requiredEquipment.length > 0) {
    const installedEquipment = candidate.roomEquipments.map((re) =>
      re.equipment.name.toLowerCase()
    );
    const missing = cls.requiredEquipment.filter(
      (req) => !installedEquipment.some((inst) => inst.includes(req.toLowerCase()))
    );
    if (missing.length > 0) {
      violations.push(`Missing required equipment: [${missing.join(', ')}]`);
    }
  }

  return {
    isViolated: violations.length > 0,
    violations,
  };
}

/**
 * Section 30 & 38: Soft Scoring Algorithm with Student Travel Distance calculation
 */
function calculateSoftScores(
  candidate: CandidateRoom,
  cls: { studentCount: number; requiredRoomType: string; requiredEquipment: string[] },
  slot: { dayOfWeek: string; startTime: string; endTime: string },
  currentBuilding?: { id: string; latitude: number | null; longitude: number | null },
  facultyPreferredBuildingId?: string,
  weights: WeightConfig = DEFAULT_WEIGHTS
): { score: number; breakdown: ScoreBreakdown; reasons: string[]; travelDistanceMeters: number | null } {
  const reasons: string[] = [];

  // 1. Capacity Suitability (weight: 25)
  const excess = candidate.capacity - cls.studentCount;
  const ratio = excess / candidate.capacity;
  let capacityRatio = 0.6;
  if (ratio >= 0.05 && ratio <= 0.35) capacityRatio = 1.0;
  else if (ratio > 0.35 && ratio <= 0.6) capacityRatio = 0.8;
  else if (ratio < 0.05) capacityRatio = 0.85;
  const capacityScore = Number((capacityRatio * weights.capacity).toFixed(1));
  if (capacityRatio >= 0.85) {
    reasons.push(`Capacity is sufficient (${candidate.capacity} seats for ${cls.studentCount} students)`);
  }

  // 2. Equipment Match (weight: 20)
  let equipRatio = 1.0;
  if (cls.requiredEquipment.length > 0) {
    const installed = candidate.roomEquipments.map((re) => re.equipment.name.toLowerCase());
    const matched = cls.requiredEquipment.filter((req) =>
      installed.some((inst) => inst.includes(req.toLowerCase()))
    ).length;
    equipRatio = matched / cls.requiredEquipment.length;
  }
  const equipmentScore = Number((equipRatio * weights.equipment).toFixed(1));
  if (equipRatio === 1.0) reasons.push('Required equipment available');

  // 3. Availability (weight: 20)
  const isAvailable = !candidate.timetables.some(
    (t) =>
      t.dayOfWeek === slot.dayOfWeek &&
      t.startTime < slot.endTime &&
      t.endTime > slot.startTime &&
      t.status !== 'CANCELLED'
  );
  const availRatio = isAvailable ? 1.0 : 0.0;
  const availabilityScore = Number((availRatio * weights.availability).toFixed(1));
  if (isAvailable) reasons.push(`Room available at selected time (${slot.startTime})`);

  // 4. Room Type Match (weight: 15)
  const typeRatio = candidate.type === cls.requiredRoomType ? 1.0 : 0.4;
  const roomTypeScore = Number((typeRatio * weights.roomType).toFixed(1));
  if (typeRatio === 1.0) reasons.push('Room type matches requirement');

  // 5. Utilization Balance (weight: 10)
  const projectedUtil = (cls.studentCount / candidate.capacity) * 100;
  let utilRatio = 0.7;
  if (projectedUtil >= 60 && projectedUtil <= 90) utilRatio = 1.0;
  else if (projectedUtil > 90) utilRatio = 0.85;
  else if (projectedUtil < 60) utilRatio = 0.75;
  const utilizationScore = Number((utilRatio * weights.utilization).toFixed(1));
  if (utilRatio >= 0.85) reasons.push('Provides better campus space utilization');

  // 6. Faculty Preference (weight: 5)
  const facRatio =
    facultyPreferredBuildingId && candidate.building.id === facultyPreferredBuildingId ? 1.0 : 0.6;
  const facultyPreferenceScore = Number((facRatio * weights.facultyPreference).toFixed(1));
  if (facRatio === 1.0) reasons.push('Matches instructor preferred building location');

  // 7. Student Travel Distance (weight: 5) - Section 38
  const distance = calculateHaversineDistance(
    currentBuilding?.latitude,
    currentBuilding?.longitude,
    candidate.building.latitude,
    candidate.building.longitude
  );

  let travelRatio = 1.0; // Default neutral if location data unavailable
  if (distance !== null) {
    if (distance === 0) {
      travelRatio = 1.0;
      reasons.push('Same building (zero student travel displacement)');
    } else if (distance <= 100) {
      travelRatio = 0.9;
      reasons.push(`Adjacent facility (${distance}m walking distance)`);
    } else if (distance <= 250) {
      travelRatio = 0.7;
    } else if (distance <= 500) {
      travelRatio = 0.5;
    } else {
      travelRatio = 0.3;
    }
  } else if (currentBuilding && candidate.building.id === currentBuilding.id) {
    travelRatio = 1.0;
    reasons.push('Same building');
  }

  const studentTravelScore = Number((travelRatio * weights.studentTravel).toFixed(1));

  // Also include no-conflict reason
  reasons.push('No new conflict created');

  const totalScore = Math.round(
    capacityScore +
      equipmentScore +
      availabilityScore +
      roomTypeScore +
      utilizationScore +
      facultyPreferenceScore +
      studentTravelScore
  );

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      capacity: capacityScore,
      equipment: equipmentScore,
      availability: availabilityScore,
      roomType: roomTypeScore,
      utilization: utilizationScore,
      facultyPreference: facultyPreferenceScore,
      studentTravel: studentTravelScore,
    },
    reasons,
    travelDistanceMeters: distance,
  };
}

/**
 * Section 31: Candidate Room Search
 */
export async function getCandidateRoomsForConflict(
  conflictId: string,
  userWeights?: Partial<WeightConfig>
): Promise<{
  conflict: any;
  candidates: ScoredCandidate[];
  totalEligible: number;
}> {
  const conflict = await conflictRepository.findById(conflictId);
  if (!conflict) throw new Error(`Conflict ${conflictId} not found`);

  const cls = conflict.class;
  const currentRoom = conflict.room;

  if (!cls) throw new Error(`No class associated with conflict ${conflictId}`);
  if (!currentRoom) throw new Error(`No room associated with conflict ${conflictId}`);

  const weights: WeightConfig = { ...DEFAULT_WEIGHTS, ...userWeights };

  const timetableSlot = cls.timetables?.[0];
  const slot = {
    dayOfWeek: timetableSlot?.dayOfWeek ?? 'MONDAY',
    startTime: timetableSlot?.startTime ?? '09:00',
    endTime: timetableSlot?.endTime ?? '10:00',
  };

  const facultyPref = cls.facultyId
    ? await prisma.facultyPreference.findFirst({
        where: { facultyId: cls.facultyId },
      })
    : null;

  const allRooms = await getAllCandidateRooms();
  const potentialRooms = allRooms.filter((r) => r.id !== currentRoom.id);

  const scored: ScoredCandidate[] = potentialRooms.map((room) => {
    const hardCheck = evaluateHardConstraints(room, cls, slot);
    const soft = calculateSoftScores(
      room,
      cls,
      slot,
      currentRoom.building ? {
        id: currentRoom.building.id,
        latitude: currentRoom.building.latitude,
        longitude: currentRoom.building.longitude,
      } : undefined,
      facultyPref?.preferredBuildingId ?? undefined,
      weights
    );

    return {
      room,
      score: hardCheck.isViolated ? 0 : soft.score,
      scoreBreakdown: soft.breakdown,
      reasons: soft.reasons,
      isHardConstraintViolated: hardCheck.isViolated,
      violatedConstraints: hardCheck.violations,
      travelDistanceMeters: soft.travelDistanceMeters,
    };
  });

  const eligible = scored.filter((c) => !c.isHardConstraintViolated).sort((a, b) => b.score - a.score);
  const ineligible = scored.filter((c) => c.isHardConstraintViolated);

  return {
    conflict,
    candidates: [...eligible, ...ineligible],
    totalEligible: eligible.length,
  };
}

/**
 * Section 32, 33, 34: Recommendation Generation with Structured Explainability & Before vs After
 */
export async function generateRecommendationForConflict(
  conflictId: string,
  userWeights?: Partial<WeightConfig>
): Promise<RecommendationResponse> {
  const { conflict, candidates } = await getCandidateRoomsForConflict(conflictId, userWeights);

  const validCandidates = candidates.filter((c) => !c.isHardConstraintViolated);
  if (validCandidates.length === 0) {
    throw new Error('No eligible candidate room found satisfying all hard constraints');
  }

  const best = validCandidates[0];
  const alternatives = validCandidates.slice(1);

  const cls = conflict.class;
  const currentRoom = conflict.room;

  // Section 34: Calculate Before vs After metrics
  const activeConflictsCount = await prisma.conflict.count({
    where: { status: { in: ['OPEN', 'IN_REVIEW'] } },
  });

  const currentRoomUtil = currentRoom.capacity > 0 ? (cls.studentCount / currentRoom.capacity) * 100 : 0;
  const recommendedRoomUtil = best.room.capacity > 0 ? (cls.studentCount / best.room.capacity) * 100 : 0;

  const beforeVsAfter: BeforeVsAfterMetrics = {
    conflictsBefore: activeConflictsCount,
    conflictsAfter: Math.max(0, activeConflictsCount - 1),
    utilizationBefore: Number(currentRoomUtil.toFixed(1)),
    utilizationAfter: Number(recommendedRoomUtil.toFixed(1)),
    capacityEfficiency: Number(((cls.studentCount / best.room.capacity) * 100).toFixed(1)),
    studentTravelDistanceMeters: best.travelDistanceMeters,
    measurableImprovement: `Space utilization optimized from ${currentRoomUtil.toFixed(0)}% to ${recommendedRoomUtil.toFixed(0)}% with 0 scheduling collisions.`,
  };

  const recommendationTitle = `MOVE ${cls.course?.name?.toUpperCase() || 'CLASS'} → ${best.room.name.toUpperCase()}`;

  // Persist / upsert Recommendation record in database
  await prisma.recommendation.deleteMany({
    where: { conflictId, status: 'PENDING' },
  });

  await recommendationRepository.create({
    conflictId,
    recommendedRoomId: best.room.id,
    score: best.score,
    reason: best.reasons.join('. '),
    capacityScore: best.scoreBreakdown.capacity,
    equipmentScore: best.scoreBreakdown.equipment,
    availabilityScore: best.scoreBreakdown.availability,
    roomTypeScore: best.scoreBreakdown.roomType,
    utilizationScore: best.scoreBreakdown.utilization,
    facultyPreferenceScore: best.scoreBreakdown.facultyPreference,
    studentTravelScore: best.scoreBreakdown.studentTravel,
  });

  await conflictRepository.updateStatus(conflictId, 'IN_REVIEW');

  return {
    recommendation: recommendationTitle,
    recommendedRoom: best.room,
    score: best.score,
    scoreBreakdown: best.scoreBreakdown,
    reasons: best.reasons,
    beforeVsAfter,
    alternativeRooms: alternatives,
  };
}

/**
 * Section 35: Transaction-Safe Approval Workflow
 *
 * Atomically executes:
 * 1. Re-validates room availability.
 * 2. Begins DB Transaction.
 * 3. Updates timetable slots.
 * 4. Reassigns class room.
 * 5. Creates OptimizationRun.
 * 6. Creates OptimizationChange.
 * 7. Recalculates and marks conflict RESOLVED.
 * 8. Creates Notification.
 * 9. Commits transaction. (Auto rollback on error)
 */
export async function approveRecommendationTransaction(
  recommendationId: string,
  approvedBy: string = 'Campus Administrator'
): Promise<{
  success: boolean;
  optimizationRunId: string;
  optimizationChangeId: string;
  message: string;
}> {
  const rec = await prisma.recommendation.findUnique({
    where: { id: recommendationId },
    include: {
      conflict: {
        include: {
          class: { include: { course: true, timetables: true } },
          room: true,
        },
      },
      recommendedRoom: true,
    },
  });

  if (!rec) throw new Error(`Recommendation ${recommendationId} not found`);
  if (!rec.conflict?.class) throw new Error(`No class associated with recommendation ${recommendationId}`);
  if (!rec.conflict?.room) throw new Error(`No original room associated with conflict`);

  const cls = rec.conflict.class;
  const oldRoom = rec.conflict.room;
  const newRoom = rec.recommendedRoom;

  // Re-verify room collision before committing
  const timetableSlot = cls.timetables?.[0];
  if (timetableSlot) {
    const collision = await prisma.timetable.findFirst({
      where: {
        roomId: newRoom.id,
        dayOfWeek: timetableSlot.dayOfWeek,
        id: { not: timetableSlot.id },
        status: { not: 'CANCELLED' },
        AND: [
          { startTime: { lt: timetableSlot.endTime } },
          { endTime: { gt: timetableSlot.startTime } },
        ],
      },
    });

    if (collision) {
      throw new Error(`Target room ${newRoom.name} is no longer available at the scheduled time slot.`);
    }
  }

  // Execute in an ACID database transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Mark recommendation APPROVED
    await tx.recommendation.update({
      where: { id: recommendationId },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
      },
    });

    // 2. Reassign class room
    await tx.class.update({
      where: { id: cls.id },
      data: { assignedRoomId: newRoom.id },
    });

    // 3. Update Timetable matrix
    await tx.timetable.updateMany({
      where: { classId: cls.id, roomId: oldRoom.id },
      data: { roomId: newRoom.id },
    });

    // 4. Create OptimizationRun
    const optRun = await tx.optimizationRun.create({
      data: {
        trigger: 'MANUAL',
        status: 'COMPLETED',
        beforeUtilization: oldRoom.capacity > 0 ? (cls.studentCount / oldRoom.capacity) * 100 : 0,
        afterUtilization: newRoom.capacity > 0 ? (cls.studentCount / newRoom.capacity) * 100 : 0,
        conflictsBefore: 1,
        conflictsAfter: 0,
        completedAt: new Date(),
      },
    });

    // 5. Create OptimizationChange
    const optChange = await tx.optimizationChange.create({
      data: {
        optimizationRunId: optRun.id,
        classId: cls.id,
        oldRoomId: oldRoom.id,
        newRoomId: newRoom.id,
        oldTime: timetableSlot ? `${timetableSlot.dayOfWeek} ${timetableSlot.startTime}–${timetableSlot.endTime}` : undefined,
        newTime: timetableSlot ? `${timetableSlot.dayOfWeek} ${timetableSlot.startTime}–${timetableSlot.endTime}` : undefined,
        reason: rec.reason || `Reallocated from ${oldRoom.name} to ${newRoom.name}`,
        improvementScore: rec.score,
      },
    });

    // 6. Recalculate & resolve conflict
    await tx.conflict.update({
      where: { id: rec.conflictId },
      data: { status: 'RESOLVED' },
    });

    // 7. Update room utilization numbers
    const newRoomUtil = (cls.studentCount / newRoom.capacity) * 100;
    await tx.room.update({
      where: { id: newRoom.id },
      data: { utilization: Number(newRoomUtil.toFixed(1)), status: 'AVAILABLE' },
    });

    // 8. Create Notification
    await tx.notification.create({
      data: {
        title: 'Official Room Reallocation Approved',
        message: `${cls.course.name} has been officially reallocated from ${oldRoom.name} to ${newRoom.name} by ${approvedBy}.`,
        type: 'ROOM_CHANGE',
        isRead: false,
      },
    });

    return {
      optimizationRunId: optRun.id,
      optimizationChangeId: optChange.id,
    };
  });

  return {
    success: true,
    optimizationRunId: result.optimizationRunId,
    optimizationChangeId: result.optimizationChangeId,
    message: `Reallocation of ${cls.course.name} to ${newRoom.name} successfully committed to official timetable.`,
  };
}

/**
 * Section 35: Rejection Workflow
 */
export async function rejectRecommendation(recommendationId: string): Promise<void> {
  await recommendationRepository.reject(recommendationId);
}
