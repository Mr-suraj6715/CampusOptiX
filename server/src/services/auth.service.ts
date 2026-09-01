import { userRepository } from '../repositories/user.repository';
import { roomRepository } from '../repositories/room.repository';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.schema';
import { Role } from '@prisma/client';

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role as Role,
      departmentId: input.departmentId,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token,
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token,
    };
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      facultyProfile: user.facultyProfile,
    };
  },
};

export const roomService = {
  async listRooms(filters?: any) {
    return roomRepository.listAll(filters);
  },

  async getRoomById(id: string) {
    const room = await roomRepository.findById(id);
    if (!room) throw new Error(`Room with ID ${id} not found`);
    return room;
  },

  async createRoom(data: any) {
    return roomRepository.create(data);
  },

  async updateRoom(id: string, data: any) {
    return roomRepository.update(id, data);
  },

  async deleteRoom(id: string) {
    return roomRepository.delete(id);
  },

  async updateRoomStatus(id: string, status: any) {
    return roomRepository.updateStatus(id, status);
  },

  // Lab specific helpers (Section 24)
  async listLabs(filters?: any) {
    return roomRepository.listAll({ ...filters, isLab: true });
  },

  async getLabById(id: string) {
    const lab = await roomRepository.findById(id);
    if (!lab) throw new Error(`Lab with ID ${id} not found`);
    return lab;
  },

  async createLab(data: any) {
    return roomRepository.create({
      ...data,
      type: data.type || 'COMPUTER_LAB',
    });
  },

  async updateLab(id: string, data: any) {
    return roomRepository.update(id, data);
  },

  async deleteLab(id: string) {
    return roomRepository.delete(id);
  },
};
