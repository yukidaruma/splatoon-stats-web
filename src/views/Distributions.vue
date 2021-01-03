<template>
  <div>
    <template v-if="distributions">
      <div>
        <ranked-rule-picker v-model="ruleId" as-id no-all-rules />
        {{ total }} players
      </div>

      <div>
        Interval:
        <select v-model="interval">
          <option :key="value" v-for="value in intervalOptions" :value="value">{{ value }}</option>
        </select>
      </div>

      <DistributionChart
        :color="chartColor"
        :data="distributions[ruleId]"
        :title="$t(`rules.${findRuleKey(ruleId)}`)"
        :total="total"
        :interval="interval"
      />
    </template>
  </div>
</template>

<script>
import client from '../api-client';
import DistributionChart from '../components/DistributionChart';
import RankedRulePicker from '../components/RankedRulePicker.vue';
import { chartColors } from '../components/PlayerSummaryXRankedChart';
import { findRuleKey } from '../helper';

export default {
  components: { DistributionChart, RankedRulePicker },
  data() {
    const intervalOptions = [10, 20, 50, 100];
    return {
      distributions: null,
      ruleId: 1,
      intervalOptions,
      interval: intervalOptions[1],
    };
  },
  computed: {
    chartColor() {
      return chartColors[this.ruleId - 1];
    },
    total() {
      return this.distributions[this.ruleId].count;
    },
  },
  async created() {
    const { data } = await client.get('/distributions');
    this.distributions = data;
  },
  methods: { findRuleKey },
};
</script>
