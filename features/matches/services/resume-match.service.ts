import {
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

type Params = {

  matchId: string;
};

export async function resumeMatchService({
  matchId,
}: Params) {

  const ref =
    doc(
      db,
      'matches',
      matchId,
    );

  await updateDoc(
    ref,
    {

      status:
        'live',

      startedAt:
        serverTimestamp(),
    },
  );
}