// features/predio/hooks/usePredio.ts

import {
  useEffect,
  useState,
} from 'react';

import {
  PredioStats,
  PredioDonation,
} from '../types/predio.types';

import {
  subscribeToPredioStats,
  subscribeToRecentDonations,
} from '../services/predio.service';

const initialStats: PredioStats = {
  totalGoal: 12750000,
  totalRaised: 0,
  totalM2: 750,
  pricePerM2: 17000,
};

export default function usePredio() {

  const [
    stats,
    setStats,
  ] = useState(initialStats);

  const [
    donations,
    setDonations,
  ] = useState<
    PredioDonation[]
  >([]);

  useEffect(() => {

    const unsubscribe =
      subscribeToPredioStats(
        setStats
      );

    return unsubscribe;

  }, []);

  useEffect(() => {

    const unsubscribe =
      subscribeToRecentDonations(
        setDonations
      );

    return unsubscribe;

  }, []);

  const completedSquares =
    Math.floor(
      stats.totalRaised /
      stats.pricePerM2
    );

  const percentage =
    Number(
      (
        (
          stats.totalRaised /
          stats.totalGoal
        ) * 100
      ).toFixed(1)
    );

  return {
    stats,
    donations,
    completedSquares,
    percentage,
  };
}