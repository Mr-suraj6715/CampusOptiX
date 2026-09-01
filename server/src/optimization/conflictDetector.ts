import prisma from '../config/prisma';
import { ConflictType, ConflictSeverity, RoomStatus } from '@prisma/client';
import { conflictRepository } from '../repositories/conflict.repository';

export interface ConflictResult {
  type: ConflictType;
  severity: ConflictSeverity;
  classId: string;
  roomId: string;
  description: string;
}

/**
 * Deterministic Conflict Detection Engine (Section 28)
 *
 * Guaranteed 100% deterministic rule-based evaluation.
 * Never relies on probabilistic LLM output for hard academic scheduling constraints.
 */
export async function detectAllConflicts(): Promise<ConflictResult[]> {
  const results: ConflictResult[] = [];

  const classes = await prisma.class.findMany({
    include: {
      course: true,
      assignedRoom: {
        include: {
          roomEquipments: { include: { equipment: true } },
          building: true,
        },
      },
      timetables: { where: { status: { not: 'CANCELLED' } } },
      faculty: { include: { user: true } },
    },
  });

  const rooms = await prisma.room.findMany({
    include: {
      building: true,
      roomEquipments: { include: { equipment: true } },
    },
  });

  for (const cls of classes) {
    if (!cls.assignedRoom) continue;

    const room = cls.assignedRoom;

    // =========================================================================
    // 1. CAPACITY CHECK: studentCount > room.capacity
    // =========================================================================
    if (cls.studentCount > room.capacity) {
      const overflow = cls.studentCount - room.capacity;
      const severity: ConflictSeverity =
        overflow > 30 ? 'CRITICAL' : overflow > 15 ? 'HIGH' : overflow > 5 ? 'MEDIUM' : 'LOW';
      results.push({
        type: 'CAPACITY',
        severity,
        classId: cls.id,
        roomId: room.id,
        description:
          `${cls.course.name} (${cls.course.courseCode}) has ${cls.studentCount} enrolled students ` +
          `assigned to ${room.name} (${room.roomCode}) with capacity ${room.capacity} (overflow: ${overflow} students).`,
      });
    }

    // =========================================================================
    // 2. ROOM TYPE CHECK: required room type does not match assigned room
    // =========================================================================
    if (cls.requiredRoomType && room.type !== cls.requiredRoomType) {
      results.push({
        type: 'ROOM_TYPE',
        severity: 'HIGH',
        classId: cls.id,
        roomId: room.id,
        description:
          `${cls.course.name} requires room type '${cls.requiredRoomType}' but ` +
          `is assigned to ${room.name} which is of type '${room.type}'.`,
      });
    }

    // =========================================================================
    // 3. EQUIPMENT CHECK: class requires equipment unavailable in assigned room
    // =========================================================================
    if (cls.requiredEquipment && cls.requiredEquipment.length > 0) {
      const availableEquipment = room.roomEquipments.map(
        (re) => re.equipment.name.toLowerCase()
      );
      const missing = (cls.requiredEquipment as string[]).filter(
        (req) => !availableEquipment.some((av) => av.includes(req.toLowerCase()))
      );
      if (missing.length > 0) {
        results.push({
          type: 'EQUIPMENT',
          severity: 'HIGH',
          classId: cls.id,
          roomId: room.id,
          description:
            `${cls.course.name} requires equipment [${missing.join(', ')}] ` +
            `not installed in ${room.name}.`,
        });
      }
    }

    // =========================================================================
    // 4. RESOURCE AVAILABILITY CHECK: room is under maintenance / unavailable
    // =========================================================================
    if (room.status === 'MAINTENANCE' || room.status === 'RESERVED') {
      results.push({
        type: 'RESOURCE_UNAVAILABLE',
        severity: room.status === 'MAINTENANCE' ? 'CRITICAL' : 'HIGH',
        classId: cls.id,
        roomId: room.id,
        description:
          `Assigned facility ${room.name} is currently flagged as '${room.status}' and unavailable for teaching.`,
      });
    }

    // =========================================================================
    // 5. ROOM-TIME CHECK: overlapping timetable entries in the same room
    // =========================================================================
    for (const slot of cls.timetables) {
      const roomOverlap = await prisma.timetable.findFirst({
        where: {
          roomId: room.id,
          dayOfWeek: slot.dayOfWeek,
          id: { not: slot.id },
          status: { not: 'CANCELLED' },
          AND: [
            { startTime: { lt: slot.endTime } },
            { endTime: { gt: slot.startTime } },
          ],
        },
        include: { class: { include: { course: true } } },
      });

      if (roomOverlap) {
        results.push({
          type: 'ROOM_TIME',
          severity: 'CRITICAL',
          classId: cls.id,
          roomId: room.id,
          description:
            `Room scheduling collision: ${room.name} has overlapping classes on ` +
            `${slot.dayOfWeek} (${slot.startTime}–${slot.endTime}) between ` +
            `'${cls.course.name}' and '${roomOverlap.class.course.name}'.`,
        });
      }

      // =======================================================================
      // 6. FACULTY-TIME CHECK: one faculty member with overlapping classes
      // =======================================================================
      if (cls.facultyId) {
        const facultyOverlap = await prisma.timetable.findFirst({
          where: {
            dayOfWeek: slot.dayOfWeek,
            id: { not: slot.id },
            status: { not: 'CANCELLED' },
            class: { facultyId: cls.facultyId },
            AND: [
              { startTime: { lt: slot.endTime } },
              { endTime: { gt: slot.startTime } },
            ],
          },
          include: { class: { include: { course: true } } },
        });

        if (facultyOverlap) {
          const instructorName = cls.faculty?.user?.name || 'Assigned Instructor';
          results.push({
            type: 'FACULTY_TIME',
            severity: 'HIGH',
            classId: cls.id,
            roomId: room.id,
            description:
              `Instructor scheduling collision: ${instructorName} is simultaneously booked on ` +
              `${slot.dayOfWeek} (${slot.startTime}–${slot.endTime}) for both ` +
              `'${cls.course.name}' and '${facultyOverlap.class.course.name}'.`,
          });
        }
      }
    }
  }

  // Persist newly discovered anomalies into database
  for (const conflict of results) {
    const existing = await prisma.conflict.findFirst({
      where: {
        classId: conflict.classId,
        roomId: conflict.roomId,
        type: conflict.type,
        status: { in: ['OPEN', 'IN_REVIEW'] },
      },
    });
    if (!existing) {
      await conflictRepository.create(conflict);
    }
  }

  return results;
}
