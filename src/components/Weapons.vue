<template>
  <div>
    <div class="controls">
      <div>
        <span class="label">Data source</span>
        <select class="l" v-model="rankingType">
          <!-- Todo: splatfest -->
          <option value="x">X Ranked</option>
          <option value="league">Leagues</option>
        </select>
      </div>
      <div>
        <span class="label">Weapon type</span>
        <select class="l" v-model="weaponType">
          <option value="weapons">Main Weapons</option>
          <option value="subs">Subs</option>
          <option value="specials">Specials</option>
        </select>
      </div>
      <div>
        <span class="label">Rule</span>
        <ranked-rule-picker class="l" :defaultRule="rankedRule" @rule-change="onRuleChange" />
      </div>
      <!-- Todo:
      <div>
        Filter by power
      </div>
      -->
      <div>
        <span class="label">Date</span>
        <date-picker ref="datePicker" :defaultRankingType="rankingType"
          :defaultYear="year" :defaultMonth="month" @time-change="onTimeChange" />
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
            <img class="weapon-icon" :src="weapon.icon">{{ $t(weapon.namePath) }}
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
import { capitalizeFirstLetters, formatRankingEntry, rankedRules } from '../helper';

import DatePicker from './DatePicker.vue';
import RankedRulePicker from './RankedRulePicker.vue';

const getLastMonth = () => moment.utc().add({ month: -1 });

export default {
  name: 'Weapons',
  data() {
    return {
      title: '',
      isLoading: false,
      lastFetchedTime: 0,
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
  },
  filters: {
    formatPercentage(percentage) {
      return (percentage / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 3 });
    },
  },
  methods: {
    capitalizeFirstLetters,
    fetchWeaponRanking() {
      const rankedRule = this.rankedRule ? this.rankedRule : '';
      const path = `/${this.weaponType}/${this.rankingType}/${this.year}/${this.month + 1}/${rankedRule}`;

      this.isLoading = true;
      this.$router.push(`/weapons${path}`);
      apiClient
        .get(path)
        .then((res) => {
          if (res.data.length === 0) {
            this.weapons = [];
            return;
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
            ${ this.capitalizeFirstLetters(this.rankingType === 'x' ? 'x ranked' : this.rankingType) }
            ${ this.capitalizeFirstLetters(this.rankedRule ? this.rankedRule.split('_').join(' ') : '') }
            in ${ this.year }-${ this.month + 1 }`;
          this.isLoading = false;
        });
    },
    onTimeChange(time) {
      this.year = time.year();
      this.month = time.month();
    },
    onRuleChange(rule) {
      this.rankedRule = rule;
    },
  },
  computed: {
    weaponTypeTitleName() {
      return this.weaponType === 'weapons' ? 'main weapons' : this.weaponType;
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
    if (['weapons', 'specials', 'subs'].includes(weaponType)) {
      this.weaponType = weaponType;
    }
    if (['x', 'league'].includes(rankingType)) {
      this.rankingType = rankingType;
    }
    if (rankedRules.map(rule => rule.key).includes(rankedRule)) {
      this.rankedRule = rankedRule;
    }

    this.fetchWeaponRanking();
  },
  watch: {
    rankingType(newRankingType) {
      this.$refs.datePicker.updateDatePicker(newRankingType);
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
