import { Player } from '@/interfaces';

const PlayerName: React.FC<{ player: Player }> = ({ player }) => {
  return <span className="player-name">{player.name ?? <i>{player.id}</i>}</span>;
};

export default PlayerName;
