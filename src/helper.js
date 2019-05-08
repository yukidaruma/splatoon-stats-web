const weaponIcon = (weaponType, weaponId) => {
  const singularWeaponType = weaponType.substring(0, weaponType.length - 1);
  return `http://localhost:3000/static/images/${singularWeaponType}/${weaponId}.png`;
};

export { weaponIcon }; // eslint-disable-line import/prefer-default-export
