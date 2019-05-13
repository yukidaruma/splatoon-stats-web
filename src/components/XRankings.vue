<template>
  <div>
    <div>
      Date: <date-picker rankingType="x" :defaultYear="year" :defaultMonth="month"
        @time-change="onTimeChange" />
    </div>
    <div>
      Rule: <ranked-rule-picker :defaultRule="rankedRule" noAllRules="true" @rule-change="onRuleChange" />
    </div>

    <ranking rankingType="x" :ranking="ranking" :loading="loading" />
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import DatePicker from './DatePicker.vue';
import RankedRulePicker from './RankedRulePicker.vue';
import Ranking from './Ranking.vue';
import { findRuleKey, formatRankingEntry } from '../helper';

export default {
  name: 'XRankings',
  components: { DatePicker, RankedRulePicker, Ranking },
  props: ['defaultYear', 'defaultMonth', 'defaultRankedRule'],
  data() {
    return {
      ranking: [],
      loading: false,
      year: undefined,
      month: undefined,
      rankedRule: undefined,
    };
  },
  methods: {
    fetchXRanking() {
      const path = `/rankings/x/${this.year}/${this.month + 1}/${this.rankedRule}`;

      this.loading = true;
      this.$router.push(path);
      apiClient.get(path)
        .then((res) => {
          this.ranking = res.data.map(weapon => formatRankingEntry(weapon, 'weapons'));
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
  created() {
    // You can assume year and month are valid, too, if defaultRankedRule is valid
    if (['splat_zones', 'tower_control', 'rainmaker', 'clam_blitz'].includes(this.defaultRankedRule)) {
      this.year = this.defaultYear;
      this.month = this.defaultMonth - 1;
      this.rankedRule = this.defaultRankedRule;
    } else {
      const lastMonth = moment.utc().add({ month: -1 });
      this.year = lastMonth.year();
      this.month = lastMonth.month();
      this.rankedRule = findRuleKey(1);
    }

    this.fetchXRanking();

    this.$watch(
      () => [this.$data.rankedRule, this.$data.year, this.$data.month],
      () => {
        this.fetchXRanking();
      },
    );
  },
};
</script>
