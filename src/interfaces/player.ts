import { RawPlayer, RawPlayerSearchResult } from '.';

const isRawPlayerSearchResult = (player: Record<string, any>): player is RawPlayerSearchResult => {
  return !!player.last_used;
};

export default class Player {
  public id!: string;
  public name!: Nullable<string>;
  public lastUsed?: Date;
  public xPower?: number;
  public weaponId?: Nullable<number>;

  public constructor(player: Pick<Player, 'id' | 'name' | 'lastUsed' | 'weaponId' | 'xPower'>) {
    Object.assign(this, player);
  }

  public static fromRawPlayer(player: RawPlayer | RawPlayerSearchResult): Player {
    const data: ConstructorParameters<typeof Player>[0] = {
      id: player.player_id,
      name: player.player_name ?? null,
      weaponId: player.weapon_id ?? null,
    };

    if (isRawPlayerSearchResult(player)) {
      data.lastUsed = new Date(player.last_used.replace(' ', 'T') + '.000Z');
      data.xPower = player.max_x_rating;
    }

    return new Player(data);
  }
}
