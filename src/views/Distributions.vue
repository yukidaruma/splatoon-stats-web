<template>
  <div>
    <h1 style="margin-bottom: 0.5em">Top 500 X Power Distribution</h1>

    <template v-if="distributions">
      <div>
        Rule: <ranked-rule-picker v-model="ruleId" as-id no-all-rules /> ({{ total }} unique
        players)
      </div>

      <div>
        Interval:
        <select v-model="interval">
          <option :key="value" v-for="value in intervalOptions" :value="value">{{ value }}</option>
        </select>
      </div>

      <DistributionChart
        :color="chartColor"
        :data="ruleDistribution"
        :title="$t(`rules.${findRuleKey(ruleId)}`)"
        :interval="interval"
      />

      <table class="table">
        <thead>
          <tr>
            <th>X Power</th>
            <th>Players</th>
            <th>Players in range</th>
            <th>Percentile</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :key="classValue.rating"
            v-for="classValue in Object.values(ruleDistribution).reverse()"
          >
            <td>{{ classValue.rating }}</td>
            <td>{{ classValue.accumlative }}</td>
            <td>{{ classValue.y }}</td>
            <td>{{ classValue.percentile.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
import client from '../api-client';
import DistributionChart from '../components/DistributionChart';
import RankedRulePicker from '../components/RankedRulePicker.vue';
import { chartColors } from '../components/PlayerSummaryXRankedChart';
import { findRuleKey } from '../helper';

const groupByCriteria = (data, criteria) => {
  const aggregated = {};

  data.forEach((item) => {
    const [key, value] = criteria(item);
    if (aggregated[key]) return;

    aggregated[key] = value;
  });

  return aggregated;
};

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
    ruleDistribution() {
      const rawRuleDistribution = this.distributions[this.ruleId].distributions;
      const groupedByInterval = groupByCriteria(
        Object.entries(rawRuleDistribution),
        ([realKey, value]) => {
          const rating = Number(realKey);
          const key = rating - (rating % this.interval);
          return [key, value];
        },
      );

      const entries = Object.entries(groupedByInterval);
      return Object.fromEntries(
        entries.map(([rating, accumlative], i) => {
          let y = accumlative;
          if (i < entries.length - 1) {
            y -= entries[i + 1][1];
          }

          const percentile = ((this.total - accumlative) / this.total) * 100;
          return [
            rating,
            {
              rating,
              y,
              accumlative,
              percentile,
            },
          ];
        }),
      );
    },
  },
  methods: {
    findRuleKey,
    getPlayerInClass(c) {
      const { distributions } = this.ruleDistribution;
      const distributionClass = Number(c);
      const playersInClass = distributions[c] ?? 0;
      const playersInNextClass = distributions[distributionClass + this.interval] ?? 0;

      return playersInClass - playersInNextClass;
    },
  },
  async created() {
    const { data } = await client.get('/distributions');
    this.distributions = data;
  },
};
</script>
