import {
  doc,
  onSnapshot,
  collection,
  limit,
  orderBy,
  query,
  addDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  PredioStats,
} from '../types/predio.types';

export function subscribeToPredioStats(
  callback: (
    stats: PredioStats
  ) => void
) {

  const ref = doc(
    db,
    'predio_stats',
    'main'
  );

  return onSnapshot(
    ref,
    (snapshot) => {

      if (!snapshot.exists()) {
        return;
      }

      callback(
        snapshot.data() as PredioStats
      );

    }
  );
}

export function subscribeToRecentDonations(
  callback: (data: any[]) => void
) {

  const ref = collection(
    db,
    'predio_donations'
  );

  const q = query(
    ref,
    orderBy(
      'createdAt',
      'desc'
    ),
    limit(10)
  );

  return onSnapshot(
    q,
    (snapshot) => {

      const donations =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      callback(donations);

    }
  );
}

type CreateDonationParams = {
  nombreDonador: string;
  monto: number;
};

export async function createPredioDonation({
  nombreDonador,
  monto,
}: CreateDonationParams) {

  await addDoc(
    collection(
      db,
      'predio_donations'
    ),
    {
      nombreDonador,
      monto,
      createdAt:
        serverTimestamp(),
    }
  );

  await updateDoc(
    doc(
      db,
      'predio_stats',
      'main'
    ),
    {
      totalRaised:
        increment(monto),
    }
  );
}