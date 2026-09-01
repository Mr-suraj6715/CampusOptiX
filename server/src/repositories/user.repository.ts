import prisma from '../config/prisma';
import { Role } from '@prisma/client';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        department: true,
        facultyProfile: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
        facultyProfile: true,
      },
    });
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    departmentId?: string;
  }) {
    return prisma.user.create({
      data,
      include: {
        department: true,
      },
    });
  },

  async listAll(role?: Role) {
    return prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        createdAt: true,
      },
    });
  },
};

export const departmentRepository = {
  async listAll() {
    return prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true,
            faculty: true,
            courses: true,
            classes: true,
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        faculty: { include: { user: true } },
        courses: true,
        classes: true,
      },
    });
  },

  async create(data: { name: string; code: string }) {
    return prisma.department.create({ data });
  },
};
