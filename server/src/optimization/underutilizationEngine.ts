import prisma from '../config/prisma';
import { RoomStatus } from '@prisma/client';

export interface UnderutilizationRecord {
  roomId: string;
  roomCode: string;
  roomName: string;
  buildingName: string;
  capacity: number;
  classCount: number;
  assignedStudentCount: number;
  utilization: number;
  threshold: number;
  isUnderutilized: boolean;
  status: RoomStatus;
}

export const underutilizationEngine = {
  /**
   * Calculates space utilization percentage:
   * utilization = (studentCount / room.capacity) * 100
   */
  calculateUtilization(studentCount: number, capacity: number): number {
    if (capacity <= 0) return 0;
    const util = (studentCount / capacity) * 100;
    return Number(util.toFixed(2));
  },

  /**
   * Scans all campus resources against a configurable threshold.
   * Default threshold: 50%
   */
  async scanUnderutilizedRooms(
    customThreshold: number = 50.0,
    autoUpdateStatus: boolean = false
  ): Promise<{
    scannedCount: number;
    underutilizedCount: number;
    threshold: number;
    records: UnderutilizationRecord[];
  }> {
    const rooms = await prisma.room.findMany({
      include: {
        building: true,
        classes: true,
      },
    });

    const records: UnderutilizationRecord[] = [];
    let underutilizedCount = 0;

    for (const room of rooms) {
      // Calculate total or peak students assigned to this room
      const totalStudents = room.classes.reduce((sum, c) => sum + c.studentCount, 0);
      const effectiveThreshold = room.utilizationThreshold || customThreshold;
      const utilization = this.calculateUtilization(totalStudents, room.capacity);
      const isUnderutilized = utilization < effectiveThreshold && room.classes.length > 0;

      if (isUnderutilized) {
        underutilizedCount++;
        if (autoUpdateStatus && room.status === 'AVAILABLE') {
          await prisma.room.update({
            where: { id: room.id },
            data: { status: 'UNDERUTILIZED', utilization },
          });
        }
      }

      records.push({
        roomId: room.id,
        roomCode: room.roomCode,
        roomName: room.name,
        buildingName: room.building.name,
        capacity: room.capacity,
        classCount: room.classes.length,
        assignedStudentCount: totalStudents,
        utilization,
        threshold: effectiveThreshold,
        isUnderutilized,
        status: room.status,
      });
    }

    return {
      scannedCount: rooms.length,
      underutilizedCount,
      threshold: customThreshold,
      records: records.sort((a, b) => a.utilization - b.utilization),
    };
  },
};
