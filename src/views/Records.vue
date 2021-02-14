<template>
  <div class="root-container">
    <h1 class="title">Records</h1>

    <tab-switcher
      v-model="activeTab"
      :tabs="[
        {
          key: 'x-weapons-all',
          label: 'X Weapon (All)',
        },
        {
          key: 'x-weapons',
          label: 'X Weapon',
        },
        {
          key: 'x-powers',
          label: 'X Power',
        },
        {
          key: 'league-weapons',
          label: 'League Weapon',
        },
        {
          key: 'league-weapon-combinations',
          label: 'League Weapons',
        },
        {
          key: 'league-powers',
          label: 'League Power',
        },
        {
          key: 'monthly-league-battles',
          label: 'Monthly League Battles',
        },
      ]"
    />

    <div v-show="activeTab === 'x-weapons-all'" class="table-container x-weapons-all">
      <table class="table is-hoverable is-striped is-fullwidth">
        <thead>
          <tr>
            <th><span class="is-hidden-mobile">Weapon</span></th>
            <th>{{ $t('rules.splat_zones') }}</th>
            <th>{{ $t('rules.tower_control') }}</th>
            <th>{{ $t('rules.rainmaker') }}</th>
            <th>{{ $t('rules.clam_blitz') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="weapon in weapons" :key="weapon.weapon_id">
            <td>
              <div class="is-flex weapon-name-container h-space-between-4">
                <img class="weapon-icon" :src="weapon.icon">
                <span class="is-hidden-mobile">{{ $t(weapon.localizationKey) }}</span>
              </div>
            </td>
            <td v-for="(player, ruleId) in weapon.top_players" :key="`${weapon.weapon_id}-${ruleId}`">
              <div class="player" v-if="player">
                <p>{{ player.rating }}</p>
                <p><player-link :player="new Player(player.player_id, player.name)" /></p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-show="activeTab === 'x-weapons'" class="x-weapons">
      <div class="records-controls">
        <div class="is-flex" style="align-items: center">
          <weapon-picker :value.sync="xWeapon.id" open-button-label="Select Weapon" single />
          <button @click="fetchXWeaponRecords()" :disabled="xWeapon.isloading">Go</button>
        </div>
        <div>
          <a @click="xWeapon.allRules = !xWeapon.allRules">
            {{ xWeapon.allRules ? 'Group by rule' : 'Ungroup by rule' }}
          </a>
        </div>
      </div>

      <div v-if="xWeapon.isLoading">
        Loading...
      </div>
      <div v-else class="columns is-multiline">
        <template v-if="xWeapon.allRules">
          <div class="column">
            <h2>All rules <small>({{ xWeapon.records[0].count }})</small></h2>
            <x-records :records="xWeapon.records[0].records" as-all-rules />
          </div>
        </template>
        <template v-else>
          <div v-for="({ count, records }, ruleId) in xWeaponRuleRecords" class="column is-6" :key="ruleId">
            <h2>{{ $t(`rules.${findRuleKey(ruleId)}`) }} <small>({{ count }})</small></h2>
            <x-records :records="records" />
          </div>
        </template>
      </div>
    </div>

    <div v-show="activeTab === 'x-powers'" class="columns is-multiline">
      <div v-for="(records, i) in xRecords" class="column is-6" :key="i">
        <h2>{{ $t(`rules.${findRuleKey(i + 1)}`) }}</h2>
        <x-records :records="records" :order="i" :rule-id="i + 1" />
      </div>
    </div>

    <div v-show="activeTab === 'league-weapons'" class="league-weapons table-container">
      <div class="is-flex records-controls" style="align-items: center">
        <league-team-type-picker v-model="leagueWeapon.groupType" :no-all="true" />
        <weapon-picker style="margin-left: 1em" :value.sync="leagueWeapon.id" open-button-label="Select Weapon" single />
        <button @click="fetchLeagueWeaponRecords()" :disabled="leagueWeapon.isLoading">Go</button>
      </div>

      <div v-if="leagueWeapon.isLoading">
        Loading...
      </div>
      <div v-else class="v-space-between-6">
        <div v-for="(records, ruleId) in leagueWeapon.records">
          <h2>{{ $t(`rules.${findRuleKey(ruleId)}`) }}</h2>
          <table class="table is-hoverable is-striped is-fullwidth">
            <tbody>
              <template v-for="(record, rank) in records">
                <player-ranking-entry
                  rankingType="league"
                  :as-records="true"
                  :rank="rank + 1"
                  :ranking-entry="record"
                />
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'league-weapon-combinations'" class="league-weapon-combinations table-container">
      <div class="is-flex records-controls" style="align-items: center">
        <league-team-type-picker v-model="leagueWeapons.groupType" :no-all="true" />
        <multi-weapon-picker :length="leagueTeamTypeMemers[leagueWeapons.groupType]" :value.sync="leagueWeapons.ids" open-button-label="Select Weapons" />
        <button @click="fetchLeagueWeaponRecords(true)" :disabled="leagueWeapons.isLoading || !leagueWeapons.ids || leagueWeapons.ids.some((id) => typeof id !== 'number')">Go</button>
      </div>

      <div v-if="leagueWeapons.isLoading">
        Loading...
      </div>
      <div v-else class="v-space-between-6">
        <div v-for="(records, ruleId) in leagueWeapons.records">
          <h2>{{ $t(`rules.${findRuleKey(ruleId)}`) }}</h2>
          <table class="table is-hoverable is-striped is-fullwidth">
            <tbody>
              <template v-for="(record, rank) in records">
                <player-ranking-entry
                  rankingType="league"
                  :as-records="true"
                  :rank="rank + 1"
                  :ranking-entry="record"
                />
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'league-powers'" class="league table-container">
      <div class="records-controls">
        <league-team-type-picker v-model="leaguePowersActiveTab" :no-all="true" />
      </div>

      <div v-for="(groupTypeRecords, k) in leagueRecords" v-show="leaguePowersActiveTab === LeagueTeamTypes[k]" :key="k">
        <template v-for="(groupRecords, i) in groupTypeRecords">
          <h2>{{ $t(`rules.${findRuleKey(i + 1)}`) }}</h2>
          <table class="table is-hoverable is-striped is-fullwidth">
            <tbody>
              <template v-for="(record, rank) in groupRecords">
                <player-ranking-entry
                  rankingType="league"
                  :as-records="true"
                  :rank="rank + 1"
                  :ranking-entry="mapLeagueRecord(record, i + 1)"
                />
              </template>
            </tbody>
          </table>
        </template>
      </div>
    </div>

    <div class="table-container" v-show="activeTab === 'monthly-league-battles'">
      <table class="table is-hoverable is-striped is-fullwidth">
        <tbody>
          <tr v-for="record in monthlyLeagueBattlesRecords">
            <td>
              <router-link :to="`/rankings/league/${leagueId(record.start_time)}${record.group_type}`">
                {{ formatTime(record.start_time) }}
              </router-link>
            </td>
            <td>{{ record.rating }}</td>
            <td>{{ $t(`ui.rule_shortnames.${findRuleKey(record.rule_id)}`) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weapon-icon {
  max-width: inherit;
}

@media screen and (min-width: 769px) {
  thead th:first-child {
    padding-left: 32px;
  }
}

@media screen and (max-width: 768px) {
  .root-container {
    position: relative;
  }
  .table-container.x-weapons-all {
    margin-left: 40px;
    th:nth-child(1) {
      padding: 0;
    }
    td:nth-child(1) {
      border: 0;
      position: absolute;
      width: 40px;
      left: 0;
    }
  }
}

.league {
  .controls div:first-of-type {
    margin-top: 0;
  }

  tr {
    display: grid;
    grid-template-columns: 4em 1fr auto 13em;
  }
}

.records-controls + div {
  margin-top: 1em;
}

h2 {
  margin-bottom: .25em;
}
</style>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { findRuleKey, formatRankingEntry } from '../helper';
import Player from '../player';

import LeagueTeamTypePicker, { LeagueTeamTypes, LeagueTeamTypesTable, teamTypeSymbols, leagueTeamTypeMemers } from '../components/LeagueTeamTypePicker.vue';
import PlayerLink from '../components/PlayerLink.vue';
import PlayerRankingEntry from '../components/PlayerRankingEntry.vue';
import TabSwitcher from '../components/TabSwitcher.vue';
import WeaponPicker from '../components/WeaponPicker.vue';
import MultiWeaponPicker from '../components/MultiWeaponPicker.vue';
import XRecords from '../components/XRecords.vue';

const mapTeammates = (member) => ({
  player_id: member[0],
  weapon_id: member[1],
  player_name: member[2],
});

export default {
  name: 'Records',
  components: {
    LeagueTeamTypePicker, PlayerLink, PlayerRankingEntry, TabSwitcher, WeaponPicker, MultiWeaponPicker, XRecords,
  },
  created() {
    this.restoreStateByHash();
  },
  data() {
    return {
      LeagueTeamTypes,
      leagueTeamTypeMemers,
      activeTab: 'x-weapons-all',
      monthlyLeagueBattlesRecords: [],
      leaguePowersActiveTab: LeagueTeamTypes.team,
      isLoading: false,
      leagueWeapon: {
        id: 0,
        isLoading: false,
        groupType: LeagueTeamTypes.team,
        records: null,
      },
      leagueWeapons: {
        ids: null,
        isLoading: false,
        groupType: LeagueTeamTypes.team,
        records: null,
      },
      xWeapon: {
        id: 0,
        isLoading: false,
        records: null,
        allRules: false,
      },
      leagueRecords: [],
      weapons: {},
      xRecords: [],
    };
  },
  computed: {
    hash() {
      const hash = `${this.activeTab}`;
      let data = null;

      switch (this.activeTab) {
        case 'x-weapons':
          data = this.xWeapon.id.toString() + (this.xWeapon.allRules ? '-all' : '');
          break;
        case 'league-weapons':
          data = teamTypeSymbols[this.leagueWeapon.groupType] + this.leagueWeapon.id;
          break;
        case 'league-weapon-combinations':
          data = teamTypeSymbols[this.leagueWeapons.groupType] + this.leagueWeapons.ids.join(',');
          break;
        case 'league-powers':
          data = teamTypeSymbols[this.leaguePowersActiveTab];
          break;
        default:
      }

      return data !== null ? `${hash};${data}` : hash;
    },
    xWeaponRuleRecords() {
      if (!this.xWeapon.records) {
        return {};
      }

      return Object.fromEntries(Object.entries(this.xWeapon.records).filter(([key, _]) => Number(key) > 0));
    },
  },
  watch: {
    hash(value) {
      if (value && this.$route.hash !== `#${value}`) {
        this.$router.push({ hash: value });
      }
    },
    '$route.hash'() {
      this.restoreStateByHash(false);
    },
  },
  methods: {
    findRuleKey,
    Player,
    restoreStateByHash(shouldFetch = true) {
      const hash = this.$route.hash.replace('#', '');

      if (hash) {
        const [activeTab, data] = hash.split(';');
        this.activeTab = activeTab;
        switch (activeTab) {
          case 'x-weapons':
            this.xWeapon.id = Number.parseInt(data.replace('-all', ''), 10);
            this.xWeapon.allRules = data.includes('-all');
            if (shouldFetch) {
              this.fetchXWeaponRecords();
            }
            break;
          case 'league-weapons': {
            const [teamType, ...weaponId] = data;
            this.leagueWeapon.groupType = LeagueTeamTypesTable[teamType];
            this.leagueWeapon.id = Number.parseInt(weaponId.join('', ''), 10);
            if (shouldFetch) {
              this.fetchLeagueWeaponRecords();
            }
            break;
          }
          case 'league-weapon-combinations': {
            const [teamType, ...weaponIds] = data;
            this.leagueWeapons.groupType = LeagueTeamTypesTable[teamType];
            this.leagueWeapons.ids = weaponIds.join('').split(',').map((id) => Number.parseInt(id, 10));
            if (shouldFetch) {
              this.fetchLeagueWeaponRecords(true);
            }
            break;
          }
          case 'league-powers':
            this.leaguePowersActiveTab = LeagueTeamTypesTable[data];
            break;
          default:
        }
      }

      if (shouldFetch) {
        this.fetchWeaponsTopPlayers();
      }
    },
    leagueId(time) {
      return moment(time).format('YYMMDDHH');
    },
    formatTime(time) {
      return moment.utc(time).local().format('YYYY-MM');
    },
    formatTimeLeague(time) {
      return moment.utc(time).local().format('YYYY-MM-DD HH:mm');
    },
    async fetchLeagueWeaponRecords(isWeapons = false) {
      const ranking = isWeapons ? this.leagueWeapons : this.leagueWeapon;
      const params = { group_type: teamTypeSymbols[ranking.groupType] };
      if (isWeapons) {
        params.weapon_ids = ranking.ids.join(',');
      } else {
        params.weapon_id = ranking.id;
      }

      ranking.isLoading = true;
      const { data } = await apiClient.get(
        '/records/league-weapon',
        { params },
      );

      ranking.isLoading = false;
      ranking.records = Object.fromEntries(Object.entries(data).map(([ruleId, ruleRecords]) => [
        ruleId,
        ruleRecords.map((record) => ({
          ...record,
          teammates: record.teammates.map(mapTeammates),
        })),
      ]));
    },
    async fetchXWeaponRecords() {
      this.xWeapon.isLoading = true;
      const { data } = await apiClient.get(
        '/records/x-weapon',
        { params: { weapon_id: this.xWeapon.id } },
      );

      this.xWeapon.isLoading = false;
      this.xWeapon.records = data;
    },
    fetchWeaponsTopPlayers() {
      apiClient
        .get('/records')
        .then((res) => {
          this.leagueRecords = res.data.league_rating_records;
          this.monthlyLeagueBattlesRecords = res.data.monthly_league_battles_records;
          this.weapons = res.data.weapons_top_players.map((weapon) => formatRankingEntry(weapon, 'weapons'));
          this.xRecords = res.data.x_ranked_rating_records
            .map((ruleRecords) => ruleRecords
              .map((record) => formatRankingEntry(record, 'weapons', 'x'))
              .map((record) => {
                const startTime = moment.utc(record.start_time);
                record.year = startTime.year();
                record.month = startTime.month() + 1;
                return record;
              }));
        });
    },
    mapLeagueRecord(record, ruleId) {
      return {
        ...record,
        rule_id: ruleId,
        teammates: record.teammates.map(mapTeammates),
      };
    },
  },
};
</script>
