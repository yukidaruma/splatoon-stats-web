import { Image, ImageProps } from '@chakra-ui/react';

const Weapon: React.FC<{ weaponId: number } & ImageProps> = (props) => {
  const src = `${process.env.SPLATOON_STATS_API_URL}/static/images/weapon/${props.weaponId}.png`;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} display="inline" src={src} boxSize="32px" />;
};

export default Weapon;
