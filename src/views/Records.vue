<template>
  <div class="root-container">
    <h1 class="title">Records</h1>

    <tab-switcher
      v-model="activeTab"
      :tabs="[
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
          key: 'league-powers',
          label: 'League Power',
        },
        {
          key: 'monthly-league-battles',
          label: 'Monthly League Battles',
        },
      ]"
    />

    <div v-show="activeTab === 'x-weapons'" class="table-container x-weapons">
      <table class="table is-hoverable is-striped is-fullwidth">
        <thead>
          <tr>
            <th><span class="is-hidden-mobile">Weapon</span></th>
            <th>{{ $t('rules.splat_zones.name') }}</th>
            <th>{{ $t('rules.tower_control.name') }}</th>
            <th>{{ $t('rules.rainmaker.name') }}</th>
            <th>{{ $t('rules.clam_blitz.name') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="weapon in weapons" :key="weapon.weapon_id">
            <td>
              <div class="weapon-name-container">
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

    <div v-show="activeTab === 'x-powers'" class="columns is-multiline">
      <template v-for="(records, i) in xRecords">
        <div class="column is-6">
          <h3>{{$t(`ui.rule_shortnames.${findRuleKey(i + 1)}`)}}</h3>
          <table class="table is-hoverable is-striped is-fullwidth">
            <tbody>
              <tr v-for="record in records">
                <td>{{record.rating}}</td>
                <td>
                  <div class="weapon-name-container">
                    <img class="weapon-icon" :src="record.icon">
                    <player-link :player="new Player(record.player_id, record.player_name)" />
                  </div>
                </td>
                <td>
                  <router-link :to="`/rankings/x/${record.year}/${record.month}/${findRuleKey(i + 1)}`">{{formatTime(record.start_time)}}</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <div v-show="activeTab === 'league-weapons'" class="league-weapons table-container">
      <div class="is-flex" style="align-items: center">
        <league-team-type-picker v-model="leagueWeaponRecordsGroupType" :no-all="true" />
        <weapon-picker style="margin-left: 1em" :value.sync="leagueWeapon" open-button-label="Select Weapon" single />
        <button @click="fetchLeagueWeaponRecords(leagueWeapon)" :disabled="isLoadingLeagueWeaponsRecords">Go</button>
      </div>

      <div v-if="isLoadingLeagueWeaponsRecords">
        Loading...
      </div>
      <div v-else v-for="(records, ruleId) in leagueWeaponRecords">
        <h2>{{ $t(`rules.${findRuleKey(ruleId)}.name`) }}</h2>
        <table class="table is-hoverable is-striped is-fullwidth">
          <tbody>
            <template v-for="record in records">
              <player-ranking-entry
                rankingType="league"
                :as-records="true"
                :ranking-entry="record"
              />
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-show="activeTab === 'league-powers'" class="league table-container">
      <div v-for="(groupTypeRecords, k) in leagueRecords">
        <h2>{{$t(`ui.team_types.${k}`)}}</h2>

        <template v-for="(groupRecords, i) in groupTypeRecords">
          <h3>{{$t(`ui.rule_shortnames.${findRuleKey(i + 1)}`)}}</h3>
          <table class="table is-hoverable is-striped is-fullwidth">
            <tbody>
              <template v-for="record in groupRecords">
                <player-ranking-entry
                  rankingType="league"
                  :as-records="true"
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
  .table-container.x-weapons {
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

.league-weapons > div:not(:first-child) {
  margin-top: 1em;
}
</style>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { findRuleKey, formatRankingEntry } from '../helper';
import Player from '../player';

import LeagueTeamTypePicker, { LeagueTeamTypes, teamTypeSymbols } from '../components/LeagueTeamTypePicker.vue';
import PlayerLink from '../components/PlayerLink.vue';
import PlayerRankingEntry from '../components/PlayerRankingEntry.vue';
import TabSwitcher from '../components/TabSwitcher.vue';
import WeaponPicker from '../components/WeaponPicker.vue';

const mapTeammates = (member) => ({
  player_id: member[0],
  weapon_id: member[1],
  player_name: member[2],
});

export default {
  name: 'Records',
  components: {
    LeagueTeamTypePicker, PlayerLink, PlayerRankingEntry, TabSwitcher, WeaponPicker,
  },
  data() {
    return {
      activeTab: 'x-weapons',
      monthlyLeagueBattlesRecords: [],
      isLoadingLeagueWeaponsRecords: true,
      leagueWeapon: 0,
      leagueWeaponRecordsGroupType: LeagueTeamTypes.team,
      leagueWeaponRecords: null,
      leagueRecords: [],
      weapons: {},
      xRecords: [],
    };
  },
  methods: {
    findRuleKey,
    Player,
    leagueId(time) {
      return moment(time).format('YYMMDDHH');
    },
    formatTime(time) {
      return moment.utc(time).local().format('YYYY-MM');
    },
    formatTimeLeague(time) {
      return moment.utc(time).local().format('YYYY-MM-DD HH:mm');
    },
    async fetchLeagueWeaponRecords() {
      this.isLoadingLeagueWeaponsRecords = true;
      const { data } = await apiClient.get(
        '/records/league-weapon',
        {
          params: {
            weapon_id: this.leagueWeapon,
            group_type: teamTypeSymbols[this.leagueWeaponRecordsGroupType],
          },
        },
      );

      this.isLoadingLeagueWeaponsRecords = false;
      this.leagueWeaponRecords = Object.fromEntries(Object.entries(data).map(([ruleId, ruleRecords]) => [
        ruleId,
        ruleRecords.map((record) => ({
          ...record,
          teammates: record.teammates.map(mapTeammates),
        })),
      ]));
    },
    fetchWeaponsTopPlayers() {
      this.isLoading = true;

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
        })
        .finally(() => {
          this.isLoading = false;
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
  created() {
    this.fetchWeaponsTopPlayers();
    this.fetchLeagueWeaponRecords(this.leagueWeapon);
  },
};
</script>
