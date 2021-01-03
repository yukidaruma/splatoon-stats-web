<template>
  <div>
    <template v-if="distributions">
      <div>
        <ranked-rule-picker v-model="ruleId" as-id no-all-rules />
        {{ distributions[ruleId].count }} players
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
      interval: intervalOptions[0],
    };
  },
  computed: {
    chartColor() {
      return chartColors[this.ruleId - 1];
    },
  },
  async created() {
    const { data } = await client.get('/distributions');
    this.distributions = data;
  },
  methods: { findRuleKey },
};
</script>
