<template>
  <table class="table is-fullwidth is-striped is-hoverable">
    <tbody>
      <tr>
        <th>Name</th>
        <th>{{ $t('ui.team_types.team') }}</th>
        <th>{{ $t('ui.team_types.pair') }}</th>
        <th>{{ $t('ui.weapon_types.weapons') }}</th>
      </tr>
      <tr v-for="peer in peers" :key="peer.playerId">
        <td>
          <player-link :player="peer" />
        </td>
        <td><router-link :to="`/rankings/league/${peer.maxRatingLeagueIds.team}T`">{{ peer.maxRatings.team }}</router-link></td>
        <td><router-link :to="`/rankings/league/${peer.maxRatingLeagueIds.pair}P`">{{ peer.maxRatings.pair }}</router-link></td>
        <td>
          <weapon-icon-count
            v-for="weapon in peer.weapons"
            :key="weapon[0]"
            :weapon-id="weapon[0]"
            :count="weapon[1]"
          />
          <span v-if="peer.hasOmittedWeapons">
            ...
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment';
import PlayerLink from './PlayerLink.vue';
import WeaponIconCount from './WeaponIconCount.vue';

const stringCollator = new Intl.Collator(undefined).compare;
const WEAPONS_LIMIT = 5;
const groupTypeTable = { P: 'pair', T: 'team' };

export const aggregateLeagueEntries = (leagueEntries) => {
  const aggregation = {};
  const setMaxRating = (playerAggregation, groupType, rating, leagueId) => {
    if (rating > (playerAggregation.maxRatings[groupType] ?? 0)) {
      playerAggregation.maxRatings[groupType] = rating;
      playerAggregation.maxRatingLeagueIds[groupType] = leagueId;
    }
  };

  leagueEntries.forEach((entry) => {
    entry.teammates.forEach((teammate) => {
      const { player_id: id, weapon_id: weaponId, player_name: name } = teammate;
      if (!(id in aggregation)) {
        aggregation[id] = {
          name,
          id,
          count: 0,
          weapons: {},
          groupTypes: { pair: 0, team: 0 },
          maxRatings: { pair: null, team: null },
          maxRatingLeagueIds: { pair: null, team: null },
        };
      }

      aggregation[id].count += 1;
      aggregation[id].weapons[weaponId] = (aggregation[id].weapons[weaponId] ? aggregation[id].weapons[weaponId] : 0) + 1;

      setMaxRating(aggregation[id], groupTypeTable[entry.group_type], entry.rating, moment.utc(entry.start_time).format('YYMMDDHH'));

      if (entry.group_type === 'P') {
        aggregation[id].groupTypes.pair += 1;
      } else {
        aggregation[id].groupTypes.team += 1;
      }
    });
  });

  const peers = Object.entries(aggregation).map(([_, peer]) => {
    const weapons = Object.entries(peer.weapons).map(([weaponId, count]) => [Number(weaponId), count]);
    // ORDER BY count DESC, weapon_id ASC
    // LIMIT WEAPONS_LIMIT
    weapons.sort((a, b) => b[1] - a[1] || a[0] - b[0]);

    if (weapons.length > WEAPONS_LIMIT) {
      peer.hasOmittedWeapons = true;
    }

    return {
      ...peer,
      weapons: weapons.slice(0, WEAPONS_LIMIT),
    };
  });

  // = ORDER BY count DESC, id ASC
  peers.sort((a, b) => b.count - a.count || stringCollator(a.id, b.id));

  return peers;
};

export default {
  components: { PlayerLink, WeaponIconCount },
  props: {
    peers: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
td {
  vertical-align: middle !important;
}
</style>
