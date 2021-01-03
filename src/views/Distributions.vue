<template>
  <div>
    <tab-switcher
      v-model="activeTab"
      :tabs="[
        { key: 'x', label: 'X Power' },
        { key: 'league', label: 'League Power' },
      ]"
    />

    <h1 style="margin-bottom: 0.5em">
      {{ activeTab === 'x' ? 'Top 500 X Power' : 'League Ranking Power' }} Distribution
    </h1>

    <template v-if="distributionsRaw">
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

      <div v-if="activeTab === 'league'">
        {{ $t('ui.group_type') }}: <league-team-type-picker v-model="leagueTeamType" no-all />
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
import TabSwitcher from '../components/TabSwitcher.vue';
import LeagueTeamTypePicker, { LeagueTeamTypes } from '../components/LeagueTeamTypePicker.vue';

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
  components: {
    DistributionChart,
    RankedRulePicker,
    TabSwitcher,
    LeagueTeamTypePicker,
  },
  data() {
    const intervalOptions = [10, 20, 50, 100];
    return {
      activeTab: this.$route.params.type,
      distributionsRaw: null,
      ruleId: 1,
      intervalOptions,
      interval: intervalOptions[1],
      leagueTeamType: LeagueTeamTypes.team,
    };
  },
  watch: {
    activeTab: {
      handler(value) {
        this.$router.push(`/distributions/${value}`);

        this.fetch();
      },
    },
  },
  computed: {
    chartColor() {
      return chartColors[this.ruleId - 1];
    },
    distributions() {
      if (this.activeTab === 'league') {
        const leagueTeamType = Object.keys(LeagueTeamTypes)[this.leagueTeamType - 1];
        return this.distributionsRaw[leagueTeamType][this.ruleId];
      }

      return this.distributionsRaw[this.ruleId];
    },
    total() {
      return this.distributions.count;
    },
    ruleDistribution() {
      const rawRuleDistribution = this.distributions.distributions;
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
        entries
          .map(([rating, accumlative], i) => {
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
          })
          .filter(([_, item]) => item.accumlative > 0),
      );
    },
  },
  methods: {
    findRuleKey,
    async fetch() {
      this.distributionsRaw = null;
      const { data } = await client.get(`/distributions/${this.activeTab}`);

      this.distributionsRaw = data;
    },
    getPlayerInClass(c) {
      const { distributions } = this.ruleDistribution;
      const distributionClass = Number(c);
      const playersInClass = distributions[c] ?? 0;
      const playersInNextClass = distributions[distributionClass + this.interval] ?? 0;

      return playersInClass - playersInNextClass;
    },
  },
  created() {
    this.fetch();
  },
};
</script>
