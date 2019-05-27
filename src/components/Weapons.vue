<template>
  <div>
    <div class="controls">
      <div>
        <span class="label">Data source</span>
        <select class="l" v-model="rankingType">
          <!-- Todo: splatfest -->
          <option value="x">X Ranked</option>
          <option value="league">Leagues</option>
          <option value="splatfest">Splatfests</option>
        </select>
      </div>
      <div>
        <span class="label">Weapon type</span>
        <select class="l" v-model="weaponType">
          <option value="weapons">Weapons</option>
          <option value="mains">Mains</option>
          <option value="subs">Subs</option>
          <option value="specials">Specials</option>
        </select>
      </div>
      <div>
        <span class="label">Rule</span>
        <div v-if="rankingType === 'splatfest'">
          <select class="l" disabled><option>Turf War</option></select>
        </div>
        <div v-else>
          <ranked-rule-picker class="l" :defaultRule="rankedRule" @rule-change="onRuleChange" />
        </div>
      </div>
      <!-- Todo:
      <div>
        Filter by power
      </div>
      -->
      <div>
        <div style="display: inline;" v-if="rankingType === 'splatfest'">
          <span class="label">Splatfest</span>
          <splatfest-picker @splatfest-change="onSplatfestChange" />
        </div>
        <div style="display: inline;" v-else>
          <span class="label">Date</span>
          <date-picker ref="datePicker" :defaultRankingType="rankingType"
            :defaultYear="year" :defaultMonth="month" @time-change="onTimeChange" />
        </div>
        <button @click="fetchWeaponRanking"  :disabled="isLoading">Go</button>
      </div>
    </div>

    <h2 class="table-title">{{ title }}</h2>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else-if="weapons.length === 0">
      No data found.
    </div>
    <table class="ranking" v-else>
      <tr v-for="weapon in weapons" :key="weapon.key">
        <td>{{ weapon.rank }}</td>
        <td>
          <div class="weapon-name-container">
            <img class="weapon-icon" :src="weapon.icon" v-if="!weapon.hasNoIcon">
            {{ $t(weapon.localizationKey) }}
          </div>
        </td>
        <td>{{ weapon.percentage | formatPercentage }}<span class="bar-chart" :style="`width: ${weapon.relativePercentage}%`"></span></td>
      </tr>
    </table>
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import { capitalizeFirstLetters, formatRankingEntry, rankedRules, titlizeSplatfest } from '../helper';

import DatePicker from './DatePicker.vue';
import RankedRulePicker from './RankedRulePicker.vue';
import SplatfestPicker from './SplatfestPicker.vue';

const getLastMonth = () => moment.utc().add({ month: -1 });

export default {
  name: 'Weapons',
  data() {
    return {
      title: '',
      isLoading: false,
      lastFetchedTime: 0,
      selectedSplatfest: null,
      year: undefined,
      month: undefined,
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
  },
  filters: {
    formatPercentage(percentage) {
      return (percentage / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 3 });
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
    onTimeChange(time) {
      this.year = time.year();
      this.month = time.month();
    },
    onRuleChange(rule) {
      this.rankedRule = rule;
    },
    fetchWeaponRanking() {
      const rankedRule = this.rankedRule ? this.rankedRule : '';
      let path = `/weapons/${this.weaponType}/${this.rankingType}`;

      if (this.rankingType === 'splatfest') {
        path += `/${this.selectedSplatfest.region}/${this.selectedSplatfest.splatfest_id}`;
      } else {
        path += `/${this.year}/${this.month + 1}/${rankedRule}`;
      }

      this.isLoading = true;
      this.$router.push(path);
      apiClient
        .get(path)
        .then((res) => {
          if (res.data.length === 0) {
            this.weapons = [];
            return;
          }

          // Add "Bomb Launchers combined" row
          if (this.weaponType === 'specials') {
            const combinedBombLauncherPercentage = res.data
              .filter(specialWeapon => 2 <= specialWeapon.special_weapon_id && specialWeapon.special_weapon_id <= 6)
              .reduce((sum, specialWeapon) => { return sum + specialWeapon.percentage }, 0);
            const indexToInsert = res.data.findIndex(specialWeapon => specialWeapon.percentage < combinedBombLauncherPercentage);

            res.data.splice(indexToInsert, 0, {
              hasNoIcon: true,
              rank: '-',
              localizationKey: 'ui.bomb_launchers_combined',
              percentage: combinedBombLauncherPercentage,
            })
          }

          const mostUsedWeaponPercentage = res.data[0].percentage;
          this.weapons = res.data.map((weapon) => {
            weapon = formatRankingEntry(weapon, this.weaponType);
            weapon.relativePercentage = weapon.percentage / mostUsedWeaponPercentage * 100;
            return weapon;
          });
        })
        .finally(() => {
          this.title = `Most used ${this.capitalizeFirstLetters(this.weaponTypeTitleName)} for
            ${this.capitalizeFirstLetters(this.rankingType === 'x' ? 'x ranked' : this.rankingType)}
            ${this.capitalizeFirstLetters(this.rankedRule ? this.rankedRule.split('_').join(' ') : '')}`;
          if (this.rankingType === 'splatfest') {
            this.title += `in ${titlizeSplatfest(this.selectedSplatfest)}`;
          } else {
            this.title += `in ${this.year}-${this.month + 1}`;
          }
          this.isLoading = false;
        });
    },
  },
  computed: {
    weaponTypeTitleName() {
      return this.weaponType.substr(0, this.weaponType.length - 1) + (this.weaponType !== 'weapons' ? ' weapons' : '');
    },
  },
  created() {
    const { year, month, weaponType, rankingType, rankedRule } = this.$route.params;
    // https://github.com/moment/moment/issues/1639
    if (year && month && moment.utc({ year, month: month - 1 }).isValid()) {
      this.year = Number(year);
      this.month = Number(month) - 1;
    } else {
      const lastMonth = getLastMonth();
      this.year = lastMonth.year();
      this.month = lastMonth.month();
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

    // For splatfest, initial fetchWeaponRanking will be called in onSplatfestChange
    if (rankingType !== 'splatfest') {
      this.fetchWeaponRanking();
    }
  },
  watch: {
    rankingType(newRankingType) {
      if (newRankingType !== 'splatfest') {
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
