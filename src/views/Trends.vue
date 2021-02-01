<template>
  <div>
    <h1>Trends</h1>

    <div class="controls">
      <div>
        <span class="label">Weapon type</span>
        <weapon-type-picker class="l" v-model="weaponType" />
      </div>
      <div>
        <span class="label">Rule</span>
        <ranked-rule-picker class="l" v-model="rankedRule" />
      </div>
      <div>
        <span class="label">From</span>
        <date-picker v-model="oldDate" :initialRankingType="rankingType" />
      </div>
      <div>
        <span class="label">To</span>
        <date-picker v-model="newDate" :initialRankingType="rankingType" />
        <button @click="updateRoute()" :disabled="isLoading">Go</button>
      </div>
      <div class="is-flex h-space-between-8">
        <div class="is-flex align-center">
          <span class="label">Mode</span>
          <input type="radio" v-model="mode" value="chart" id="mode-chart" />
          <label for="mode-chart">Chart</label>
        </div>

        <div class="is-flex align-center">
          <input type="radio" v-model="mode" value="table" id="mode-count" />
          <label for="mode-count">Table</label>
        </div>
      </div>
      <div v-if="mode === 'table'" class="h-space-between-8">
        <div class="is-flex align-center">
          <span class="label">Show</span>
          <input type="radio" v-model="keyToShow" value="rank" id="show-rank" />
          <label for="show-rank">Rank</label>
        </div>

        <div class="is-flex align-center">
          <input type="radio" v-model="keyToShow" value="count" id="show-count" />
          <label for="show-count">Count</label>
        </div>
      </div>
    </div>

    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else-if="mode === 'chart'">
      <trends-chart :data="trendsChartData" />
    </div>
    <div v-else-if="mode === 'table'">
      <div v-if="result">
        <table class="table is-hoverable is-striped is-fullwidth">
          <thead>
            <th>{{ result.newDate.format(dateFormat) }}</th>
            <th>Weapon</th>
            <th>{{ result.oldDate.format(dateFormat) }}</th>
            <th>Diff.</th>
          </thead>
          <tbody>
            <tr v-for="weapon in weaponRecords" :key="weapon.weapon_id">
              <td>{{ weapon.current }}</td>
              <td>
                <div class="is-flex">
                  <weapon-icon-count :weapon-id="weapon.weapon_id" no-margin />
                  <span>{{ $t(weapon.localizationKey) }}</span>
                </div>
              </td>
              <td>{{ weapon.prev }}</td>
              <td>{{ weapon.diff | addSign }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        No data found.
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import apiClient from '../api-client';
import { formatRankingEntry } from '../helper';
import DatePicker from '../components/DatePicker.vue';
import RankedRulePicker from '../components/RankedRulePicker.vue';
import WeaponTypePicker from '../components/WeaponTypePicker.vue';
import WeaponIconCount from '../components/WeaponIconCount.vue';
import TrendsChart from '../components/TrendsChart.vue';

const defaultNewDate = moment().utc().add({ month: -1 });
const defaultOldDate = moment().utc().add({ month: -2 });

export default {
  name: 'Trends',
  components: {
    DatePicker,
    RankedRulePicker,
    WeaponTypePicker,
    WeaponIconCount,
    TrendsChart,
  },
  data() {
    return {
      isLoading: false,
      mode: 'chart',
      dateFormat: 'YYYY-MM',
      keyToShow: 'rank',
      weaponType: 'weapons',
      rankingType: 'x',
      rankedRule: null,
      result: null,
      newDate: defaultNewDate,
      oldDate: defaultOldDate,
    };
  },
  filters: {
    addSign(number) {
      return number > 0 ? `+${number}` : number;
    },
  },
  computed: {
    trendsChartData() {
      return this.result.trends.map(
        ({ icon, weapon_id, current_month_count, previous_month_count }) => ({
          icon,
          weapon_id,
          volume: previous_month_count - current_month_count,
        }),
      );
    },
    weaponRecords() {
      return this.result.trends.map((weapon) => {
        // eslint-disable-next-line default-case
        switch (this.keyToShow) {
          case 'rank':
            return {
              ...weapon,
              current: weapon.current_month_rank,
              prev: weapon.previous_month_rank,
              diff: weapon.previous_month_rank - weapon.current_month_rank,
            };
          case 'count':
            return {
              ...weapon,
              current: weapon.current_month_count,
              prev: weapon.previous_month_count,
              diff: weapon.current_month_count - weapon.previous_month_count,
            };
        }
      });
    },
  },
  methods: {
    applyRouteParams() {
      const { weaponType, /* rankingType, */ rankedRule } = this.$route.params;
      const newDate = moment.utc(this.$route.query.current_month, this.dateFormat);
      const oldDate = moment.utc(this.$route.query.previous_month, this.dateFormat);

      if (weaponType) {
        this.weaponType = weaponType;
      }
      if (rankedRule) {
        this.rankedRule = rankedRule;
      }

      if (oldDate.isValid() && newDate.isValid()) {
        this.newDate = newDate;
        this.oldDate = oldDate;
      }
    },
    onRouteChange() {
      this.fetchTrends();
    },
    updateRoute(isDefault = false) {
      const newDate = this.newDate.format(this.dateFormat);
      const oldDate = this.oldDate.format(this.dateFormat);
      const rankedRule = this.rankedRule ? this.rankedRule : '';
      const path = `/trends/${this.weaponType}/${this.rankingType}/${rankedRule}?previous_month=${oldDate}&current_month=${newDate}`;

      if (newDate <= oldDate) {
        return alert('"To" must be later date than "From".');
      }

      if (isDefault) {
        this.$router.replace(path);
      } else {
        this.$router.push(path);
      }
    },
    fetchTrends() {
      this.isLoading = true;
      this.result = null;

      apiClient
        .get(this.$route.fullPath)
        .then((res) => {
          const trends = res.data
            .filter((weapon) => !(weapon.current_month_count === 0 && weapon.previous_month_count === 0))
            .map((weapon) => {
              if (this.weaponType === 'specials') {
                weapon.special_weapon_id = weapon.weapon_id;
              } else if (this.weaponType === 'subs') {
                weapon.sub_weapon_id = weapon.weapon_id;
              }

              weapon = formatRankingEntry(weapon, this.weaponType);
              return weapon;
            });

          this.result = {
            newDate: this.newDate,
            oldDate: this.oldDate,
            trends,
          };
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  watch: {
    $route() {
      this.applyRouteParams();
      this.onRouteChange();
    },
  },
  created() {
    this.applyRouteParams();
    if (this.$route.name === 'trendsDefault') {
      this.updateRoute(true);
    } else {
      this.onRouteChange();
    }
  },
};
</script>
