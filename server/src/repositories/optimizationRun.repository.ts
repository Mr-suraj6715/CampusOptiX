import prisma from '../config/prisma';
import { OptimizationTrigger, OptimizationRunStatus } from '@prisma/client';

export const optimizationRunRepository = {
  async listAll(filters?: { trigger?: OptimizationTrigger; status?: OptimizationRunStatus }) {
    return prisma.optimizationRun.findMany({
      where: {
        trigger: filters?.trigger,
        status: filters?.status,
      },
      include: {
        changes: {
          include: {
            class: { include: { course: true } },
            oldRoom: true,
            newRoom: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.optimizationRun.findUnique({
      where: { id },
      include: {
        changes: {
          include: {
            class: { include: { course: true, faculty: { include: { user: true } } } },
            oldRoom: true,
            newRoom: true,
          },
        },
      },
    });
  },

  async create(data: {
    trigger?: OptimizationTrigger;
    status?: OptimizationRunStatus;
    beforeUtilization?: number;
    afterUtilization?: number;
    conflictsBefore?: number;
    conflictsAfter?: number;
  }) {
    return prisma.optimizationRun.create({
      data: {
        trigger: data.trigger ?? 'MANUAL',
        status: data.status ?? 'RUNNING',
        beforeUtilization: data.beforeUtilization ?? 0.0,
        afterUtilization: data.afterUtilization ?? 0.0,
        conflictsBefore: data.conflictsBefore ?? 0,
        conflictsAfter: data.conflictsAfter ?? 0,
      },
    });
  },

  async complete(
    id: string,
    data: {
      status?: OptimizationRunStatus;
      afterUtilization: number;
      conflictsAfter: number;
    }
  ) {
    return prisma.optimizationRun.update({
      where: { id },
      data: {
        status: data.status ?? 'COMPLETED',
        completedAt: new Date(),
        afterUtilization: data.afterUtilization,
        conflictsAfter: data.conflictsAfter,
      },
    });
  },
};

export const optimizationChangeRepository = {
  async listByRun(optimizationRunId: string) {
    return prisma.optimizationChange.findMany({
      where: { optimizationRunId },
      include: {
        class: { include: { course: true } },
        oldRoom: true,
        newRoom: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  async create(data: {
    optimizationRunId: string;
    classId: string;
    oldRoomId?: string;
    newRoomId: string;
    oldTime?: string;
    newTime?: string;
    reason?: string;
    improvementScore?: number;
  }) {
    return prisma.optimizationChange.create({
      data: {
        optimizationRunId: data.optimizationRunId,
        classId: data.classId,
        oldRoomId: data.oldRoomId,
        newRoomId: data.newRoomId,
        oldTime: data.oldTime,
        newTime: data.newTime,
        reason: data.reason,
        improvementScore: data.improvementScore ?? 0.0,
      },
      include: {
        class: { include: { course: true } },
        oldRoom: true,
        newRoom: true,
      },
    });
  },
};
