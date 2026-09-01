import prisma from '../config/prisma';
import { SimulationScenarioType } from '@prisma/client';

export const simulationRepository = {
  async listAll(createdBy?: string) {
    return prisma.simulation.findMany({
      where: createdBy ? { createdBy } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.simulation.findUnique({
      where: { id },
    });
  },

  async create(data: {
    createdBy: string;
    scenarioType: SimulationScenarioType;
    inputData: any;
    resultData: any;
  }) {
    return prisma.simulation.create({
      data: {
        createdBy: data.createdBy,
        scenarioType: data.scenarioType,
        inputData: data.inputData,
        resultData: data.resultData,
      },
    });
  },
};
