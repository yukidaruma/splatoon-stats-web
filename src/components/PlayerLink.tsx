import { Player } from '@/interfaces';
import NextLink from 'next/link';

const PlayerLink: React.FC<{ player: Player }> = ({ children, player }) => (
  <NextLink href={`/players/${player.id}`}>
    <a>{children}</a>
  </NextLink>
);

export default PlayerLink;
