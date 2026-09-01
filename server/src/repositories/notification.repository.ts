import prisma from '../config/prisma';
import { NotificationType } from '@prisma/client';

export const notificationRepository = {
  async listByUser(userId?: string, isRead?: boolean) {
    return prisma.notification.findMany({
      where: {
        userId: userId ?? undefined,
        isRead: isRead !== undefined ? isRead : undefined,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async create(data: {
    userId?: string;
    title: string;
    message: string;
    type?: NotificationType;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type ?? 'INFO',
        isRead: false,
      },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  async markAllAsRead(userId?: string) {
    return prisma.notification.updateMany({
      where: {
        userId: userId ?? undefined,
        isRead: false,
      },
      data: { isRead: true },
    });
  },
};
