<template>
  <div>
    <h1>Trends</h1>

    <div class="controls">
      <div>
        <span class="label">Weapon type</span>
        <select class="l" v-model="weaponType">
          <option value="weapons">{{ $t('ui.weapon_types.weapons') }}</option>
          <option value="mains">{{ $t('ui.weapon_types.mains') }}</option>
          <option value="subs">{{ $t('ui.weapon_types.subs') }}</option>
          <option value="specials">{{ $t('ui.weapon_types.specials') }}</option>
        </select>
      </div>
      <div>
        <span class="label">Rule</span>
        <ranked-rule-picker class="l" :defaultRule="rankedRule" @rule-change="onRuleChange" />
      </div>
      <div>
        <span class="label">From</span>
        <date-picker :defaultRankingType="rankingType"
          :defaultYear="oldDate.year()" :defaultMonth="oldDate.month()" @time-change="onOldDateChange" />
      </div>
      <div>
        <span class="label">To</span>
        <date-picker :defaultRankingType="rankingType"
          :defaultYear="newDate.year()" :defaultMonth="newDate.month()" @time-change="onNewDateChange" />
        <button @click="fetchTrends" :disabled="isLoading">Go</button>
      </div>
      <div>
        <span class="label">Show</span>
        <input type="radio" v-model="keyToShow" value="rank" id="rank">
        <label for="rank">Rank</label>

        <input type="radio" v-model="keyToShow" value="count" id="count">
        <label for="count">Count</label>
      </div>
    </div>

    <div v-if="result">
      <table class="table is-hoverable is-striped is-fullwidth">
        <thead>
          <th>{{ result.newDate.format(dateFormat) }}</th>
          <th>Weapon</th>
          <th>{{ result.oldDate.format(dateFormat) }}</th>
          <th>Diff.</th>
        </thead>
        <tbody v-if="keyToShow === 'rank'">
          <tr v-for="weapon in result.trends" :key="weapon.weapon_id">
            <td>{{ weapon.current_month_rank }}</td>
            <td>
              <div class="weapon-name-container">
                <img class="weapon-icon" :src="weapon.icon">
                {{ $t(weapon.localizationKey) }}
              </div>
            </td>
            <td>{{ weapon.previous_month_rank }}</td>
            <td>{{ weapon.previous_month_rank - weapon.current_month_rank | addSign }}</td>
          </tr>
        </tbody>
        <tbody v-else-if="keyToShow === 'count'">
          <tr v-for="weapon in result.trends" :key="weapon.weapon_id">
            <td>{{ weapon.current_month_count }}</td>
            <td>
              <div class="weapon-name-container">
                <img class="weapon-icon" :src="weapon.icon">
                {{ $t(weapon.localizationKey) }}
              </div>
            </td>
            <td>{{ weapon.previous_month_count }}</td>
            <td>{{ weapon.current_month_count - weapon.previous_month_count | addSign }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import apiClient from '../api-client';
import { formatRankingEntry } from '../helper';
import DatePicker from '../components/DatePicker.vue';
import RankedRulePicker from '../components/RankedRulePicker.vue';

const newDate = moment().utc().add({ month: -1 });
const oldDate = moment().utc().add({ month: -2 });

export default {
  name: 'Trends',
  components: { DatePicker, RankedRulePicker },
  data() {
    return {
      isLoading: false,
      dateFormat: 'YYYY-MM',
      keyToShow: 'rank',
      weaponType: 'weapons',
      rankingType: 'x',
      rankedRule: null,
      result: null,
      newDate,
      oldDate,
    };
  },
  filters: {
    addSign(number) {
      if (number > 0) {
        return '+' + number.toString();
      }
      return number;
    },
  },
  methods: {
    onNewDateChange(time) {
      this.newDate = time;
    },
    onOldDateChange(time) {
      this.oldDate = time;
    },
    onRuleChange(rule) {
      this.rankedRule = rule;
    },
    fetchTrends() {
      const newDate = this.newDate.format(this.dateFormat);
      const oldDate = this.oldDate.format(this.dateFormat);
      const rankedRule = this.rankedRule ? this.rankedRule : '';

      if (newDate <= oldDate) {
        return alert('"To" must be later date than "From".');
      }

      this.result = null;

      apiClient
        .get(`/trends/${this.weaponType}/${this.rankingType}/${rankedRule}?previous_month=${oldDate}&current_month=${newDate}`)
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
        });
    },
  },
  mounted() {
    this.fetchTrends();
  },
};
</script>
