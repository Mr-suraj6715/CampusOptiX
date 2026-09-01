import prisma from '../config/prisma';

export const courseRepository = {
  async listAll(filters?: { departmentId?: string; search?: string }) {
    return prisma.course.findMany({
      where: {
        departmentId: filters?.departmentId,
        OR: filters?.search
          ? [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { courseCode: { contains: filters.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        department: true,
        _count: { select: { classes: true } },
      },
      orderBy: { courseCode: 'asc' },
    });
  },

  async findById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        department: true,
        classes: {
          include: {
            faculty: { include: { user: true } },
            assignedRoom: true,
          },
        },
      },
    });
  },

  async create(data: any) {
    return prisma.course.create({
      data,
      include: { department: true },
    });
  },

  async update(id: string, data: any) {
    return prisma.course.update({
      where: { id },
      data,
      include: { department: true },
    });
  },

  async delete(id: string) {
    return prisma.course.delete({
      where: { id },
    });
  },
};

export const classRepository = {
  async listAll(filters?: {
    departmentId?: string;
    courseId?: string;
    facultyId?: string;
    year?: number | string;
    division?: string;
    search?: string;
  }) {
    return prisma.class.findMany({
      where: {
        departmentId: filters?.departmentId,
        courseId: filters?.courseId,
        facultyId: filters?.facultyId,
        year: filters?.year !== undefined ? Number(filters.year) : undefined,
        division: filters?.division,
        OR: filters?.search
          ? [
              { course: { name: { contains: filters.search, mode: 'insensitive' } } },
              { course: { courseCode: { contains: filters.search, mode: 'insensitive' } } },
              { faculty: { user: { name: { contains: filters.search, mode: 'insensitive' } } } },
            ]
          : undefined,
      },
      include: {
        course: true,
        department: true,
        faculty: { include: { user: true } },
        assignedRoom: { include: { building: true } },
        _count: { select: { timetables: true, conflicts: true } },
      },
      orderBy: [{ year: 'asc' }, { division: 'asc' }, { course: { courseCode: 'asc' } }],
    });
  },

  async findById(id: string) {
    return prisma.class.findUnique({
      where: { id },
      include: {
        course: true,
        department: true,
        faculty: { include: { user: true } },
        assignedRoom: { include: { building: true } },
        timetables: { include: { room: true } },
        conflicts: true,
      },
    });
  },

  async create(data: any) {
    return prisma.class.create({
      data,
      include: {
        course: true,
        department: true,
        faculty: { include: { user: true } },
        assignedRoom: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.class.update({
      where: { id },
      data,
      include: {
        course: true,
        department: true,
        faculty: { include: { user: true } },
        assignedRoom: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.class.delete({
      where: { id },
    });
  },

  async reassignRoom(classId: string, newRoomId: string) {
    return prisma.class.update({
      where: { id: classId },
      data: { assignedRoomId: newRoomId },
    });
  },
};

export const facultyRepository = {
  async listAll(filters?: { departmentId?: string; designation?: string; search?: string }) {
    return prisma.faculty.findMany({
      where: {
        departmentId: filters?.departmentId,
        designation: filters?.designation,
        OR: filters?.search
          ? [
              { user: { name: { contains: filters.search, mode: 'insensitive' } } },
              { user: { email: { contains: filters.search, mode: 'insensitive' } } },
              { facultyCode: { contains: filters.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        user: true,
        department: true,
        preferences: { include: { preferredBuilding: true } },
        _count: { select: { classes: true, timetables: true } },
      },
      orderBy: { user: { name: 'asc' } },
    });
  },

  async findById(id: string) {
    return prisma.faculty.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        preferences: { include: { preferredBuilding: true } },
        classes: { include: { course: true, assignedRoom: true } },
        timetables: { include: { room: true, class: { include: { course: true } } } },
      },
    });
  },

  async create(data: any) {
    return prisma.faculty.create({
      data,
      include: { user: true, department: true },
    });
  },

  async update(id: string, data: any) {
    return prisma.faculty.update({
      where: { id },
      data,
      include: { user: true, department: true },
    });
  },

  async delete(id: string) {
    return prisma.faculty.delete({
      where: { id },
    });
  },

  async setPreferences(facultyId: string, prefData: any) {
    return prisma.facultyPreference.upsert({
      where: { id: prefData.id || 'non-existent' },
      create: { ...prefData, facultyId },
      update: prefData,
    });
  },
};
