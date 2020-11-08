<template>
  <div>
    <h1 class="title">Popular Weapons</h1>

    <div class="controls">
      <div>
        <span class="label">Data source</span>
        <select class="l" v-model="rankingType">
          <option value="x">X Ranked</option>
          <option value="league">Leagues</option>
          <option value="splatfest">Splatfests</option>
        </select>
      </div>
      <div>
        <span class="label">Weapon type</span>
        <weapon-type-picker class="l" v-model="weaponType" />
      </div>
      <div>
        <span class="label">Rule</span>
        <div v-if="rankingType === 'splatfest'">
          <select class="l" disabled><option>{{ $t('rules.turf_war.name') }}</option></select>
        </div>
        <div v-else>
          <ranked-rule-picker class="l" v-model="rankedRule" />
        </div>
      </div>
      <!-- Todo:
        Filter by power
      -->
      <div>
        <div style="display: inline;" v-if="rankingType === 'splatfest'">
          <span class="label">Splatfest</span>
          <splatfest-picker @splatfest-change="onSplatfestChange" />
        </div>
        <div style="display: inline;" v-else>
          <span class="label">Date</span>
          <date-picker ref="datePicker" :initialRankingType="rankingType" v-model="time" />
        </div>
        <button @click="fetchWeaponRanking" :disabled="isLoading">Go</button>
      </div>
    </div>

    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else>
      <h2 v-if="title" class="title table-title">
        Most used
        <span v-if="title.weaponType">{{ $t(`ui.weapon_types.${title.weaponType}`) }}</span>
        {{ ' ' }}
        <span v-if="title.splatfestName">in Splatfest: {{ title.splatfestName }}</span>
        <span v-else>
          in {{ title.rankingType }}
          <span v-if="title.rankedRule">{{ $t(`rules.${title.rankedRule}.name`) }}</span>
          in {{ title.time }}
        </span>
      </h2>

      <div v-if="weapons.length === 0">
        No data found.
      </div>
      <table v-else class="table is-hoverable is-striped is-fullwidth">
        <tbody>
          <tr v-for="weapon in weapons" :key="weapon.key">
            <td>{{ weapon.rank }}</td>
            <td>
              <div class="weapon-name-container">
                <template v-if="shouldLinkWeapon && !weapon.hasNoIcon">
                  <router-link :to="getWeaponRankingRoute(weapon.weapon_id || weapon.sub_weapon_id || weapon.special_weapon_id || 0)" class="is-flex">
                    <img class="weapon-icon" :src="weapon.icon" v-if="!weapon.hasNoIcon">
                    {{ $t(weapon.localizationKey) }}
                  </router-link>
                </template>
                <template v-else>
                  <img class="weapon-icon" :src="weapon.icon" v-if="!weapon.hasNoIcon">
                  {{ $t(weapon.localizationKey) }}
                </template>
              </div>
            </td>
            <td class="bar-chart-container">{{ weapon.percentage | formatPercentage }}<span class="bar-chart" :style="`width: ${weapon.relativePercentage}%`"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { capitalizeFirstLetters, formatRankingEntry, titleizeSplatfest, rankedRules } from '../helper';
import weaponTable from '../weapon-table.json';

import DatePicker from '../components/DatePicker.vue';
import RankedRulePicker from '../components/RankedRulePicker.vue';
import SplatfestPicker from '../components/SplatfestPicker.vue';
import WeaponTypePicker from '../components/WeaponTypePicker.vue';

const getLastMonth = () => moment.utc().add({ month: -1 });

export default {
  name: 'Weapons',
  data() {
    return {
      title: null,
      isLoading: false,
      lastFetchedTime: 0,
      selectedSplatfest: null,
      time: null,
      rankingType: 'x',
      weaponType: 'weapons',
      rankedRule: null,
      locale: {},
      weapons: [],
    };
  },
  components: {
    DatePicker,
    RankedRulePicker,
    SplatfestPicker,
    WeaponTypePicker,
  },
  filters: {
    formatPercentage(percentage) {
      return (percentage / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 3 });
    },
  },
  computed: {
    year() {
      return this.time.year();
    },
    month() {
      return this.time.month();
    },
    shouldLinkWeapon() {
      const { rankingType } = this;
      return rankingType === 'x' || rankingType === 'splatfest';
    },
  },
  methods: {
    capitalizeFirstLetters,
    onSplatfestChange(splatfest, updateRanking) {
      this.selectedSplatfest = splatfest;
      if (updateRanking) {
        this.fetchWeaponRanking();
      }
    },
    fetchWeaponRanking() {
      const rankedRule = this.rankedRule ? this.rankedRule : '';
      let path = `/weapons/${this.weaponType}/${this.rankingType}`;

      if (this.rankingType === 'splatfest') {
        if (!this.selectedSplatfest) {
          return;
        }
        path += `/${this.selectedSplatfest.region}/${this.selectedSplatfest.splatfest_id}`;
      } else {
        path += `/${this.year}/${this.month + 1}/${rankedRule}`;
      }

      this.title = null;
      this.isLoading = true;
      this.weapons = [];
      this.$router.push(path);
      apiClient
        .get(path)
        .then((res) => {
          this.title = {
            weaponType: this.weaponType,
            rankedRule: this.rankedRule,
            rankingType: { x: 'X Ranked', league: 'League Battles', splatfest: 'Splatfest' }[this.rankingType],
          };
          if (this.rankingType === 'splatfest') {
            this.title.splatfestName = titleizeSplatfest(this.selectedSplatfest);
          } else {
            this.title.time = `${this.year}-${this.month + 1}`;
          }

          if (res.data.length === 0) {
            return;
          }

          // Add "Bomb Launchers combined" row
          if (this.weaponType === 'specials') {
            const combinedBombLauncherPercentage = res.data
              .filter((specialWeapon) => specialWeapon.special_weapon_id >= 2 && specialWeapon.special_weapon_id <= 6)
              .reduce((sum, specialWeapon) => sum + specialWeapon.percentage, 0);
            const indexToInsert = res.data.findIndex((specialWeapon) => specialWeapon.percentage < combinedBombLauncherPercentage);

            res.data.splice(indexToInsert, 0, {
              hasNoIcon: true,
              rank: '-',
              localizationKey: 'ui.bomb_launchers_combined',
              percentage: combinedBombLauncherPercentage,
            });
          }

          const mostUsedWeaponPercentage = res.data[0].percentage;
          this.weapons = res.data.map((weapon) => {
            weapon = formatRankingEntry(weapon, this.weaponType);
            weapon.relativePercentage = weapon.percentage / mostUsedWeaponPercentage * 100;
            return weapon;
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getWeaponRankingRoute(weaponId) {
      const { rankingType, rankedRule, year, month, weaponType } = this.$route.params;
      let weaponIds = weaponId.toString();

      if (weaponType !== 'weapons') {
        weaponIds = weaponTable[weaponType][weaponId].join(',');
      }

      if (rankingType === 'x') {
        return {
          name: 'rankingsX',
          params: {
            initialYear: year,
            initialMonth: month,
            initialRankedRule: rankedRule || rankedRules[0].key,
          },
          query: { weapons: weaponIds },
        };
      }

      const { splatfestId } = this.$route.params;

      return {
        name: 'rankingsSplatfest',
        params: { splatfestId },
        query: { weapons: weaponIds },
      };
    },
  },
  created() {
    const { year, month, weaponType, rankingType, rankedRule } = this.$route.params;
    // https://github.com/moment/moment/issues/1639
    if (year && month && moment.utc({ year, month: month - 1 }).isValid()) {
      this.time = moment.utc({ year, month: month - 1 });
    } else {
      this.time = getLastMonth();
    }

    if (weaponType) {
      this.weaponType = weaponType;
    }
    if (rankingType) {
      this.rankingType = rankingType;
    }
    if (rankedRule) {
      this.rankedRule = rankedRule;
    }

    // For splatfest, initial fetchWeaponRanking will be called by onSplatfestChange
    // as soon as splatfest schedules is fetched by splatfest-picker
    if (rankingType !== 'splatfest') {
      this.fetchWeaponRanking();
    }
  },
  watch: {
    rankingType(newRankingType, oldRankingType) {
      if (oldRankingType !== 'splatfest' && newRankingType !== 'splatfest') {
        this.$refs.datePicker.updateDatePicker(newRankingType);
      }
    },
  },
};
</script>

<style scoped>
.bar-chart {
  display: block;
  height: 5px;
  background: linear-gradient(45deg, #27ae60 0%, #2ecc71 100%);
}
</style>
