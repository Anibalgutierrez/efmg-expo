// features/predio/types/predio.types.ts

export interface PredioStats {
  totalGoal: number;
  totalRaised: number;
  totalM2: number;
  pricePerM2: number;
}

export interface PredioGridItem {
  id: number;
  completed: boolean;
}

export interface PredioDonation {
  id: string;
  nombreDonador: string;
  monto: number;
  createdAt?: number;
}