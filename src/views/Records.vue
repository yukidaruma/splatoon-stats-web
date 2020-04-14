<template>
  <div class="root-container">
    <h1 class="title">Records</h1>

    <tab-switcher
      v-model="activeTab"
      :tabs="[
        {
          key: 'x-weapons',
          label: 'X Weapon records',
        },
        {
          key: 'x-powers',
          label: 'X Power records',
        },
        {
          key: 'league-powers',
          label: 'League Power records',
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

    <div class="league table-container" v-show="activeTab === 'league-powers'">
      <div class="columns is-multiline" v-for="(groupTypeRecords, k) in leagueRecords">
        <div class="column is-12">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weapon-icon {
  max-width: inherit;
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
    grid-template-columns: 4em 1fr auto 12em;
  }
}
</style>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { findRuleKey, formatRankingEntry } from '../helper';
import Player from '../player';

import PlayerLink from '../components/PlayerLink.vue';
import PlayerRankingEntry from '../components/PlayerRankingEntry.vue';
import TabSwitcher from '../components/TabSwitcher.vue';

export default {
  name: 'Records',
  components: { PlayerLink, PlayerRankingEntry, TabSwitcher },
  data() {
    return {
      activeTab: 'x-weapons',
      xRecords: [],
      leagueRecords: [],
      weapons: {},
    };
  },
  methods: {
    findRuleKey,
    Player,
    formatTime(time) {
      return moment.utc(time).local().format('YYYY-MM');
    },
    formatTimeLeague(time) {
      return moment.utc(time).local().format('YYYY-MM-DD HH:mm');
    },
    fetchWeaponsTopPlayers() {
      this.isLoading = true;

      apiClient
        .get('/records')
        .then((res) => {
          this.weapons = res.data.weapons_top_players.map(weapon => formatRankingEntry(weapon, 'weapons'));
          this.xRecords = res.data.x_ranked_rating_records
            .map(ruleRecords => ruleRecords
              .map(record => formatRankingEntry(record, 'weapons', 'x'))
              .map((record) => {
                const startTime = moment.utc(record.start_time);
                record.year = startTime.year();
                record.month = startTime.month() + 1;
                return record;
              }),
            );
          this.leagueRecords = res.data.league_rating_records;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    mapLeagueRecord(record, ruleId) {
      return {
        ...record,
        rule_id: ruleId,
        teammates: record.teammates.map(member => ({
          player_id: member[0],
          weapon_id: member[1],
          player_name: member[2],
        })),
      }
    },
  },
  created() {
    this.fetchWeaponsTopPlayers();
  },
};
</script>

<style scoped>
@media screen and (min-width: 769px) {
  thead th:first-child {
    padding-left: 32px;
  }
}
</style>
