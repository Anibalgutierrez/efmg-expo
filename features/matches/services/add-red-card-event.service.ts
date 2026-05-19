import {
  addMatchEventService,
} from './add-match-event.service';

type Params = {

  matchId: string;

  minute: number;

  teamId: string;

  teamSide: 'home' | 'away';

  player: {

    id: string;

    name: string;
  };
};

export async function addRedCardEventService({
  matchId,
  minute,
  teamId,
  teamSide,
  player,
}: Params) {

  await addMatchEventService({

    matchId,

    event: {

      type:
        'red_card',

      minute,

      matchId,

      teamId,

      teamSide,

      player,
    },
  });
}