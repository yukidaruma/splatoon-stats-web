<template>
  <div>
    <h1 class="title">X Rankings</h1>

    <div class="controls">
      <div>
        <span class="label">Date</span>
        <date-picker defaultRankingType="x" :defaultYear="year" :defaultMonth="month"
          @time-change="onTimeChange" />
      </div>
      <div>
        <span class="label">Rule</span>
        <ranked-rule-picker v-model="rankedRule" :value="rankedRule" noAllRules="true" />
        <button @click="fetchXRanking" :disabled="isLoading">Go</button>
      </div>
    </div>

    <h2 class="title table-title" v-if="title">
      X Ranking for {{ title.year }}-{{ title.month }} {{ $t(`rules.${title.rankedRule}.name`) }}
    </h2>
    <ranking rankingType="x" :ranking="ranking" :isLoading="isLoading" />
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import DatePicker from '../components/DatePicker.vue';
import RankedRulePicker from '../components/RankedRulePicker.vue';
import Ranking from '../components/Ranking.vue';
import { capitalizeFirstLetters, findRuleKey, formatRankingEntry } from '../helper';

export default {
  name: 'XRankings',
  components: { DatePicker, RankedRulePicker, Ranking },
  props: ['defaultYear', 'defaultMonth', 'defaultRankedRule'],
  data() {
    return {
      ranking: [],
      isLoading: false,
      year: undefined,
      month: undefined,
      rankedRule: undefined,
      title: null,
    };
  },
  methods: {
    capitalizeFirstLetters,
    fetchXRanking() {
      const path = `/rankings/x/${this.year}/${this.month + 1}/${this.rankedRule}`;

      this.title = null;
      this.isLoading = true;
      this.$router.push(path);

      apiClient.get(path)
        .then((res) => {
          this.ranking = res.data.map(rankingEntry => formatRankingEntry(rankingEntry, 'weapons'));
          this.title = {
            rankedRule: this.rankedRule,
            year: this.year,
            month: this.month + 1,
          };
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    onTimeChange(time) {
      this.year = time.year();
      this.month = time.month();
    },
  },
  created() {
    // You can assume year and month are valid, too, if defaultRankedRule is valid
    if (this.defaultRankedRule) {
      this.year = Number(this.defaultYear);
      this.month = Number(this.defaultMonth) - 1;
      this.rankedRule = this.defaultRankedRule;
    } else {
      const lastMonth = moment.utc().add({ month: -1 });
      this.year = lastMonth.year();
      this.month = lastMonth.month();
      this.rankedRule = findRuleKey(1);
    }

    this.fetchXRanking();
  },
};
</script>
