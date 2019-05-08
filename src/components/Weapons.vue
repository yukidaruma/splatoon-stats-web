<template>
  <div>
    <div>
      Data source:
      <select v-model="rankingType">
        <!-- Todo: splatfest -->
        <option value="x">X Ranked</option>
        <option value="league">Leagues</option>
      </select>
    </div>
    <div>
      Weapon type:
      <select v-model="weaponType">
        <option value="weapons">Main Weapons</option>
        <option value="subs">Subs</option>
        <option value="specials">Specials</option>
      </select>
    </div>
    <div>
      Rule:
      <ranked-rule-picker :defaultRule="rankedRule" @rule-change="onRuleChange" />
    </div>
    <!-- Todo:
    <div>
      Filter by power
    </div>
    -->
    <div>
      Date: <date-picker :rankingType="rankingType"
        :defaultYear="year" :defaultMonth="month" @year-change="onYearChange" @month-change="onMonthChange" />
    </div>
    <h2>Most used {{ weaponTypeTitleName }} for {{ rankingType === 'x' ? 'X Ranked' : rankingType | capitalizeFirstLetter }} Battles in {{ year }}-{{ month }}</h2>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="weapons.length === 0">
      No {{ rankingType | capitalizeFirstLetter }} Ranking found for {{ weaponTypeTitleName }} {{ year }}-{{ month }}
    </div>
    <div v-else>
      <table>
        <tr v-for="weapon in weapons" :key="weapon.key">
          <td>{{ weapon.rank }}</td>
          <td>
            <div class="weapon-name-container">
              <img class="weapon-icon" :src="weapon.icon">{{ $t(weapon.namePath) }}
            </div>
          </td>
          <td>{{ weapon.percentage | formatPercentage }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import apiClient from '../api-client';
import { formatRankingEntry } from '../helper.js';

import DatePicker from './DatePicker.vue';
import RankedRulePicker from './RankedRulePicker.vue';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

export default {
  name: 'Weapons',
  data() {
    return {
      loading: false,
      year: currentYear,
      month: currentMonth - 1, // last month
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
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  methods: {
    fetchRanking() {
      const rankedRule = this.rankedRule ? this.rankedRule : '';

      this.loading = true;

      apiClient
        .get(`/${this.rankingType}/${this.weaponType}/${this.year}/${this.month}/${rankedRule}`)
        .then((res) => {
          this.weapons = res.data.map(weapon => formatRankingEntry(weapon, this.weaponType));
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onYearChange(year) {
      this.year = year;
    },
    onMonthChange(month) {
      this.month = month;
    },
    onRuleChange(rule) {
      this.rankedRule = rule;
    },
  },
  computed: {
    weaponTypeTitleName() {
      return this.$options.filters.capitalizeFirstLetter(this.weaponType === 'weapons' ? 'Main weapons' : this.weaponType);
    },
  },
  mounted() {
    this.fetchRanking();
  },
  created() {
    this.$watch(
      () => [this.$data.rankingType, this.$data.weaponType, this.$data.rankedRule, this.$data.year, this.$data.month],
      () => {
        this.fetchRanking();
      },
    );
  },
};
</script>

<style scoped>
</style>
