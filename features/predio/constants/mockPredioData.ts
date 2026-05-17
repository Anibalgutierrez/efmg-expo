// features/predio/constants/mockPredioData.ts

import { PredioStats } from "../types/predio.types";

export const mockPredioStats: PredioStats = {
  totalGoal: 12750000,
  totalRaised: 2150000,
  totalM2: 750,
  pricePerM2: 17000,
};

export const completedSquares = Math.floor(
  mockPredioStats.totalRaised / mockPredioStats.pricePerM2
);