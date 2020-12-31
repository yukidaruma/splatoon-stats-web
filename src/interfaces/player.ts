import { RawPlayer, RawPlayerSearchResult } from '.';

const isRawPlayerSearchResult = (player: Record<string, any>): player is RawPlayerSearchResult => {
  return !!player.last_used;
};

export default class Player {
  public id!: string;
  public name!: string;
  public lastUsed?: Date;
  public xPower?: number;

  public constructor(player: Pick<Player, 'id' | 'name' | 'lastUsed' | 'xPower'>) {
    Object.assign(this, player);
  }

  public static fromRawPlayer(player: RawPlayer | RawPlayerSearchResult): Player {
    const data: ConstructorParameters<typeof Player>[0] = {
      id: player.player_id,
      name: player.player_name,
    };

    if (isRawPlayerSearchResult(player)) {
      data.lastUsed = new Date(player.last_used.replace(' ', 'T') + '.000Z');
      data.xPower = player.max_x_rating;
    }

    return new Player(data);
  }
}
