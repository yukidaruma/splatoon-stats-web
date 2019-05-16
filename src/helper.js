import moment from 'moment';

const weaponIcon = (weaponType, weaponId) => {
  const singularWeaponType = weaponType.substring(0, weaponType.length - 1);
  return `http://localhost:3000/static/images/${singularWeaponType}/${weaponId}.png`;
};

const capitalizeFirstLetters = string => string.split(/ +/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const isValidPlayerId = (playerId) => {
  const validPlayerIdPattern = /^[\da-fA-Z]{16}$/;
  return validPlayerIdPattern.test(playerId);
};

const isEmptyString = str => !str || /^\s*$/.test(str);

const rankedRules = [
  { id: 1, key: 'splat_zones' },
  { id: 2, key: 'tower_control' },
  { id: 3, key: 'rainmaker' },
  { id: 4, key: 'clam_blitz' },
];
const findRuleKey = rankedRuleId => rankedRules.find(rule => rule.id === rankedRuleId).key;

const formatRankingEntry = (rankingEntry, weaponType) => {
  const weaponIdKey = {
    weapons: 'weapon_id',
    subs: 'sub_weapon_id',
    specials: 'special_weapon_id',
  }[weaponType];
  const weaponId = rankingEntry[weaponIdKey];
  const weaponTypeLocaleKey = weaponType === 'weapons' ? 'weapons' : `weapon_${weaponType}`;

  rankingEntry.namePath = `${weaponTypeLocaleKey}.${weaponId}.name`;
  rankingEntry.icon = weaponIcon(weaponType, weaponId);

  return rankingEntry;
};

// Examples:
// calculateEndTime('league', moment.utc({ ...hour: 0 })) => Date(moment.utc({ ...hour: 2 }))
// calculateEndTime('x', moment.utc({ year: 2019, month: 3 })) => Date(moment.utc({ year: 2019, month: 4 }))
const calculateEndTime = (matchmakingType, startTime) => {
  const duration = {
    x: { month: 1, day: -1 },
    league: { hour: 2 },
  }[matchmakingType];

  return moment.utc(startTime).add(duration).toDate();
};

export {
  weaponIcon,
  capitalizeFirstLetters,
  isValidPlayerId,
  isEmptyString,
  rankedRules,
  findRuleKey,
  formatRankingEntry,
  calculateEndTime,
};
