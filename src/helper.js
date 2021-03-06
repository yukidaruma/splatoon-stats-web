import moment from 'moment';
import { apiBaseUrl } from './api-client';
import { weaponReskins } from './constants';

const weaponIcon = (weaponType, weaponId) => {
  const singularWeaponType = weaponType.substring(0, weaponType.length - 1);
  // eslint-disable-next-line no-undef
  return `${apiBaseUrl}/static/images/${singularWeaponType}/${weaponId}.png`;
};

const capitalizeFirstLetters = (string) => string.split(/ +/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const isValidPlayerId = (playerId) => {
  const validPlayerIdPattern = /^[\da-fA-Z]{16}$/;
  return validPlayerIdPattern.test(playerId);
};

const isEmptyString = (str) => !str || /^\s*$/.test(str);

const rankedRules = [
  { id: 1, key: 'splat_zones' },
  { id: 2, key: 'tower_control' },
  { id: 3, key: 'rainmaker' },
  { id: 4, key: 'clam_blitz' },
];
const findRuleKey = (rankedRuleId) => rankedRules.find((rule) => rule.id === Number(rankedRuleId)).key;

const formatRankingEntry = (rankingEntry, weaponType, rankingType) => {
  if (weaponType === 'mains') {
    weaponType = 'weapons';
  }

  const weaponIdKey = {
    weapons: 'weapon_id',
    subs: 'sub_weapon_id',
    specials: 'special_weapon_id',
  }[weaponType];
  const weaponId = rankingEntry[weaponIdKey];
  const weaponTypeLocaleKey = weaponType === 'weapons' ? 'weapons' : `weapon_${weaponType}`;

  if (!('localizationKey' in rankingEntry)) {
    rankingEntry.localizationKey = `${weaponTypeLocaleKey}.${weaponId}`;
  }
  rankingEntry.icon = weaponIcon(weaponType, weaponId);

  switch (rankingType) {
    case 'x':
      rankingEntry.key = `${rankingEntry.start_time}-${rankingEntry.rule_id}`;
      break;
    case 'league':
      rankingEntry.key = `${rankingEntry.start_time}-${rankingEntry.group_id}`;
      break;
    case 'splatfest':
      rankingEntry.key = `${rankingEntry.region}-${rankingEntry.splatfest_id}`;
      break;
    default:
      break;
  }

  return rankingEntry;
};

// Examples:
// calculateEndTime('league', moment.utc({ ...hour: 0 })) => Date(moment.utc({ ...hour: 2 }))
// calculateEndTime('x', moment.utc({ year: 2019, month: 3 })) => Date(moment.utc({ year: 2019, month: 4 }))
const calculateEndTime = (rankingType, startTime) => {
  const duration = {
    x: { month: 1, day: -1 },
    league: { hour: 2 },
  }[rankingType];

  return moment.utc(startTime).add(duration).toDate();
};

const safeParseInt = (numString) => {
  if (numString === null) {
    return 0;
  }

  const num = parseInt(numString, 10);
  return Number.isNaN(num)
    ? 0
    : num;
};

const titleizeSplatfest = (splatfest) => `[${splatfest.region.toUpperCase()}] ${splatfest.team_names.join(' VS ')}`;

const unique = (iterable) => Array.from(new Set(iterable));

const weaponIdsWithReskins = (weaponIds) => {
  if (!Array.isArray(weaponIds)) {
    weaponIds = [weaponIds];
  }

  const reskins = Object.entries(weaponReskins)
    .filter(([_, original]) => weaponIds.includes(original))
    .map(([reskin, _]) => Number(reskin));

  return [...weaponIds, ...reskins];
};

export {
  capitalizeFirstLetters,
  isValidPlayerId,
  isEmptyString,
  rankedRules,
  findRuleKey,
  formatRankingEntry,
  calculateEndTime,
  safeParseInt,
  titleizeSplatfest,
  unique,
  weaponIcon,
  weaponIdsWithReskins,
};
