import { Image } from '@chakra-ui/react';

const Weapon: React.FC<{ weaponId: number }> = ({ weaponId }) => {
  const src = `${process.env.SPLATOON_STATS_API_URL}/static/images/weapon/${weaponId}.png`;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={src} boxSize="32px" />;
};

export default Weapon;
