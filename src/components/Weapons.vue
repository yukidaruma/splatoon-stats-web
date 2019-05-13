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
      Date: <date-picker ref="datePicker" :defaultRankingType="rankingType"
        :defaultYear="year" :defaultMonth="month" @time-change="onTimeChange" />
    </div>
    <h2>Most used
      {{ weaponTypeTitleName | capitalizeFirstLetters }}
      for
      {{ rankingType === 'x' ? 'x ranked' : rankingType | capitalizeFirstLetters }}
      {{ rankedRule ? rankedRule.split('_').join(' ') : '' | capitalizeFirstLetters }}
      Battles in {{ year }}-{{ month + 1 }}</h2>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="weapons.length === 0">
      No data found.
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
import moment from 'moment';

import apiClient from '../api-client';
import { formatRankingEntry, rankedRules } from '../helper';

import DatePicker from './DatePicker.vue';
import RankedRulePicker from './RankedRulePicker.vue';

const getLastMonth = () => moment.utc().add({ month: -1 });

export default {
  name: 'Weapons',
  data() {
    return {
      loading: false,
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
    capitalizeFirstLetters(string) {
      return string.split(/ +/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
  },
  methods: {
    fetchWeaponRanking() {
      const rankedRule = this.rankedRule ? this.rankedRule : '';
      const path = `/${this.weaponType}/${this.rankingType}/${this.year}/${this.month + 1}/${rankedRule}`;

      this.loading = true;
      this.$router.push(`/weapons${path}`);
      apiClient
        .get(path)
        .then((res) => {
          this.weapons = res.data.map(weapon => formatRankingEntry(weapon, this.weaponType));
        })
        .finally(() => {
          this.loading = false;
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

    this.$watch(
      () => [this.$data.rankingType, this.$data.weaponType, this.$data.rankedRule, this.$data.year, this.$data.month],
      () => {
        this.fetchWeaponRanking();
      },
    );
  },
  watch: {
    rankingType(newRankingType) {
      this.$refs.datePicker.updateDatePicker(newRankingType);
    },
  },
};
</script>

<style scoped>
</style>
