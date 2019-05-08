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
      Ranked rule:
      <select v-model="rankedRule">
        <!-- Todo: disable and show "Turf wan" when splatfest -->
        <option :value="null">All</option>
        <option value="splat_zones">Splat Zones</option>
        <option value="tower_control">Tower Control</option>
        <option value="rainmaker">Rainmaker</option>
        <option value="clam_blitz">Clam Blitz</option>
      </select>
    </div>
    <!-- Todo:
    <div>
      Filter by power
    </div>
    -->
    <h2>{{ rankingType | capitalizeFirstLetter }} Ranking for {{ weaponTypeTitleName }} {{ year }}-{{ month }}</h2>
    <date-picker :rankingType="rankingType" :defaultYear="year" :defaultMonth="month" @year-change="onYearChange" @month-change="onMonthChange"></date-picker>
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
import { weaponIcon } from '../helper.js';

import DatePicker from './DatePicker.vue';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;

export default {
  name: 'Weapons',
  data() {
    return {
      loading: false,
      year,
      month: month - 1, // last month
      rankingType: 'x',
      weaponType: 'weapons',
      rankedRule: null,
      locale: {},
      weapons: [],
    };
  },
  components: {
    DatePicker,
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
    updateRanking() {
      const rankedRule = this.rankedRule ? this.rankedRule : '';

      this.loading = true;

      apiClient
        .get(`/${this.rankingType}/${this.weaponType}/${this.year}/${this.month}/${rankedRule}`)
        .then((res) => {
          this.weapons = res.data.map((weapon) => {
            const weaponIdKey = {
              weapons: 'weapon_id',
              subs: 'sub_weapon_id',
              specials: 'special_weapon_id',
            }[this.weaponType];
            const weaponId = weapon[weaponIdKey];
            const weaponTypeLocaleKey = this.weaponType === 'weapons' ? 'weapons' : `weapon_${this.weaponType}`;

            weapon.namePath = `${weaponTypeLocaleKey}.${weaponId}.name`;
            weapon.icon = weaponIcon(this.weaponType, weaponId);
            return weapon;
          });
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
  },
  computed: {
    weaponTypeTitleName() {
      return this.$options.filters.capitalizeFirstLetter(this.weaponType === 'weapons' ? 'Main weapons' : this.weaponType);
    },
  },
  mounted() {
    this.updateRanking();
  },
  created() {
    this.$watch(
      () => [this.$data.rankingType, this.$data.weaponType, this.$data.rankedRule, this.$data.year, this.$data.month],
      () => {
        this.updateRanking();
      },
    );
  },
};
</script>

<style scoped>
</style>
