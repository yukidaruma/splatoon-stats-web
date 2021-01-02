import Player from '@/interfaces/player';

export type RawPlayer = {
  player_id: string;
  player_name?: Nullable<string>;
  weapon_id?: number;
};

export type RawPlayerSearchResult = {
  last_used: string;
  max_x_rating: number;
} & RawPlayer;

export { Player };
