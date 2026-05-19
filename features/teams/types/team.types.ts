export interface TeamPlayer {

  id: string;

  name: string;
}

export interface Team {

  id: string;

  name: string;

  shortName: string;

  slug: string;

  logo?: string;

  categoryId: string;

  createdAt: any;

  players?: TeamPlayer[];
}