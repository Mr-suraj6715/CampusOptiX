import prisma from '../config/prisma';
import { RoomStatus, RoomType } from '@prisma/client';

export const roomRepository = {
  async listAll(filters?: {
    building?: string;
    buildingId?: string;
    floor?: number;
    type?: RoomType;
    status?: RoomStatus;
    capacity?: number;
    minCapacity?: number;
    availability?: boolean | string;
    search?: string;
    isLab?: boolean;
  }) {
    const labTypes: RoomType[] = ['COMPUTER_LAB', 'SCIENCE_LAB', 'WORKSHOP'];

    const typeFilter = filters?.isLab
      ? { in: labTypes }
      : filters?.type
      ? filters.type
      : undefined;

    let statusFilter = filters?.status;
    if (filters?.availability === true || filters?.availability === 'true' || filters?.availability === 'AVAILABLE') {
      statusFilter = 'AVAILABLE';
    }

    return prisma.room.findMany({
      where: {
        OR: filters?.building
          ? [
              { buildingId: filters.building },
              { building: { name: { contains: filters.building, mode: 'insensitive' } } },
              { building: { code: { contains: filters.building, mode: 'insensitive' } } },
            ]
          : filters?.buildingId
          ? [{ buildingId: filters.buildingId }]
          : undefined,
        floor: filters?.floor !== undefined ? Number(filters.floor) : undefined,
        type: typeFilter,
        status: statusFilter,
        capacity: filters?.minCapacity
          ? { gte: Number(filters.minCapacity) }
          : filters?.capacity
          ? { gte: Number(filters.capacity) }
          : undefined,
        name: filters?.search
          ? { contains: filters.search, mode: 'insensitive' }
          : undefined,
      },
      include: {
        building: true,
        roomEquipments: {
          include: { equipment: true },
        },
        _count: {
          select: { timetables: true, conflicts: true },
        },
      },
      orderBy: [{ building: { name: 'asc' } }, { floor: 'asc' }, { name: 'asc' }],
    });
  },

  async findById(id: string) {
    return prisma.room.findUnique({
      where: { id },
      include: {
        building: true,
        roomEquipments: {
          include: { equipment: true },
        },
        timetables: {
          include: {
            class: {
              include: { course: true, faculty: { include: { user: true } } },
            },
          },
        },
        conflicts: {
          where: { status: { in: ['OPEN', 'IN_REVIEW'] } },
        },
      },
    });
  },

  async create(data: any) {
    const { equipmentIds, ...roomData } = data;
    const room = await prisma.room.create({
      data: roomData,
      include: { building: true, roomEquipments: { include: { equipment: true } } },
    });

    if (equipmentIds && Array.isArray(equipmentIds)) {
      for (const eqId of equipmentIds) {
        await prisma.roomEquipment.create({
          data: { roomId: room.id, equipmentId: eqId, quantity: 1 },
        });
      }
    }

    return this.findById(room.id);
  },

  async update(id: string, data: any) {
    const { equipmentIds, ...roomData } = data;
    await prisma.room.update({
      where: { id },
      data: roomData,
    });

    if (equipmentIds && Array.isArray(equipmentIds)) {
      await prisma.roomEquipment.deleteMany({ where: { roomId: id } });
      for (const eqId of equipmentIds) {
        await prisma.roomEquipment.create({
          data: { roomId: id, equipmentId: eqId, quantity: 1 },
        });
      }
    }

    return this.findById(id);
  },

  async delete(id: string) {
    return prisma.room.delete({
      where: { id },
    });
  },

  async updateStatus(id: string, status: RoomStatus) {
    return prisma.room.update({
      where: { id },
      data: { status },
      include: { building: true },
    });
  },

  async updateUtilization(id: string, utilization: number) {
    return prisma.room.update({
      where: { id },
      data: { utilization },
    });
  },
};

export const buildingRepository = {
  async listAll() {
    return prisma.building.findMany({
      include: {
        _count: { select: { rooms: true } },
      },
      orderBy: { name: 'asc' },
    });
  },

  async findById(id: string) {
    return prisma.building.findUnique({
      where: { id },
      include: {
        rooms: {
          include: { roomEquipments: { include: { equipment: true } } },
        },
      },
    });
  },
};
