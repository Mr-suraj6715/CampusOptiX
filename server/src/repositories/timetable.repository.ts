import prisma from '../config/prisma';
import { TimetableStatus, DayOfWeek } from '@prisma/client';

export const timetableRepository = {
  async listAll(filters?: {
    department?: string;
    departmentId?: string;
    faculty?: string;
    facultyId?: string;
    room?: string;
    roomId?: string;
    year?: number | string;
    division?: string;
    day?: DayOfWeek;
    dayOfWeek?: DayOfWeek;
    status?: TimetableStatus;
    classId?: string;
  }) {
    const dayFilter = filters?.day || filters?.dayOfWeek;
    const roomFilter = filters?.roomId || filters?.room;
    const facultyFilter = filters?.facultyId || filters?.faculty;
    const deptFilter = filters?.departmentId || filters?.department;

    return prisma.timetable.findMany({
      where: {
        classId: filters?.classId,
        roomId: roomFilter
          ? {
              in: await prisma.room
                .findMany({
                  where: {
                    OR: [
                      { id: roomFilter },
                      { name: { contains: roomFilter, mode: 'insensitive' } },
                      { roomCode: { contains: roomFilter, mode: 'insensitive' } },
                    ],
                  },
                  select: { id: true },
                })
                .then((r) => r.map((x) => x.id)),
            }
          : undefined,
        dayOfWeek: dayFilter,
        status: filters?.status,
        class: {
          year: filters?.year !== undefined ? Number(filters.year) : undefined,
          division: filters?.division,
          departmentId: deptFilter
            ? {
                in: await prisma.department
                  .findMany({
                    where: {
                      OR: [
                        { id: deptFilter },
                        { code: { contains: deptFilter, mode: 'insensitive' } },
                        { name: { contains: deptFilter, mode: 'insensitive' } },
                      ],
                    },
                    select: { id: true },
                  })
                  .then((d) => d.map((x) => x.id)),
              }
            : undefined,
          facultyId: facultyFilter
            ? {
                in: await prisma.faculty
                  .findMany({
                    where: {
                      OR: [
                        { id: facultyFilter },
                        { facultyCode: { contains: facultyFilter, mode: 'insensitive' } },
                        { user: { name: { contains: facultyFilter, mode: 'insensitive' } } },
                      ],
                    },
                    select: { id: true },
                  })
                  .then((f) => f.map((x) => x.id)),
              }
            : undefined,
        },
      },
      include: {
        class: {
          include: {
            course: true,
            faculty: { include: { user: true } },
            department: true,
          },
        },
        room: { include: { building: true } },
        faculty: { include: { user: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  },

  async findById(id: string) {
    return prisma.timetable.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            course: true,
            faculty: { include: { user: true } },
            department: true,
          },
        },
        room: { include: { building: true } },
        faculty: { include: { user: true } },
      },
    });
  },

  async checkRoomConflict(
    roomId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string
  ) {
    return prisma.timetable.findFirst({
      where: {
        roomId,
        dayOfWeek,
        id: excludeId ? { not: excludeId } : undefined,
        status: { not: 'CANCELLED' },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
    });
  },

  async checkFacultyConflict(
    facultyId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string
  ) {
    return prisma.timetable.findFirst({
      where: {
        dayOfWeek,
        id: excludeId ? { not: excludeId } : undefined,
        status: { not: 'CANCELLED' },
        class: { facultyId },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
    });
  },

  async create(data: {
    classId: string;
    roomId: string;
    facultyId?: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    status?: TimetableStatus;
  }) {
    return prisma.timetable.create({
      data: { ...data, status: data.status ?? 'SCHEDULED' },
      include: {
        class: { include: { course: true, department: true } },
        room: { include: { building: true } },
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.timetable.update({
      where: { id },
      data,
      include: {
        class: { include: { course: true, department: true } },
        room: { include: { building: true } },
      },
    });
  },

  async delete(id: string) {
    return prisma.timetable.delete({
      where: { id },
    });
  },

  async updateStatus(id: string, status: TimetableStatus) {
    return prisma.timetable.update({
      where: { id },
      data: { status },
    });
  },
};
