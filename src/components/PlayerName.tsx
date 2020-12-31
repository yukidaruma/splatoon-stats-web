import { Player } from '@/interfaces';

const PlayerName: React.FC<{ player: Player }> = ({ player }) => {
  return <span className="player-name">{player.name}</span>;
};

export default PlayerName;
