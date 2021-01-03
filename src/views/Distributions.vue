<template>
  <div>
    <template v-if="distributions">
      <div>
        <ranked-rule-picker v-model="ruleId" as-id no-all-rules />
        {{ distributions[ruleId].count }} players
      </div>

      <DistributionChart
        :color="chartColor"
        :data="distributions[ruleId]"
        :title="$t(`rules.${findRuleKey(ruleId)}`)"
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
    return { distributions: null, ruleId: 1 };
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
