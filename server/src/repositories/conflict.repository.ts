import prisma from '../config/prisma';
import { ConflictStatus, ConflictType, ConflictSeverity } from '@prisma/client';

export const conflictRepository = {
  async listAll(filters?: {
    status?: ConflictStatus;
    severity?: ConflictSeverity;
    type?: ConflictType;
    roomId?: string;
  }) {
    return prisma.conflict.findMany({
      where: {
        status: filters?.status,
        severity: filters?.severity,
        type: filters?.type,
        roomId: filters?.roomId,
      },
      include: {
        class: {
          include: {
            course: true,
            faculty: { include: { user: true } },
          },
        },
        room: { include: { building: true } },
        recommendations: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { detectedAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.conflict.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            course: true,
            faculty: { include: { user: true } },
            timetables: true,
          },
        },
        room: { include: { building: true } },
        recommendations: {
          include: {
            recommendedRoom: { include: { building: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  },

  async create(data: {
    type: ConflictType;
    severity: ConflictSeverity;
    classId: string;
    roomId: string;
    description: string;
  }) {
    return prisma.conflict.create({
      data: {
        ...data,
        status: 'OPEN',
        detectedAt: new Date(),
      },
      include: {
        class: { include: { course: true } },
        room: true,
      },
    });
  },

  async updateStatus(id: string, status: ConflictStatus) {
    return prisma.conflict.update({
      where: { id },
      data: { status },
    });
  },
};

export const recommendationRepository = {
  async findByConflict(conflictId: string) {
    return prisma.recommendation.findFirst({
      where: { conflictId, status: 'PENDING' },
      include: {
        recommendedRoom: { include: { building: true } },
        conflict: {
          include: {
            class: { include: { course: true } },
            room: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(data: {
    conflictId: string;
    recommendedRoomId: string;
    score: number;
    reason: string;
    capacityScore: number;
    equipmentScore: number;
    availabilityScore: number;
    roomTypeScore: number;
    utilizationScore: number;
    facultyPreferenceScore: number;
    studentTravelScore: number;
  }) {
    return prisma.recommendation.create({
      data: { ...data, status: 'PENDING' },
      include: {
        recommendedRoom: { include: { building: true } },
      },
    });
  },

  async approve(id: string, approvedBy?: string) {
    return prisma.recommendation.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
      },
    });
  },

  async reject(id: string) {
    return prisma.recommendation.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  },
};
