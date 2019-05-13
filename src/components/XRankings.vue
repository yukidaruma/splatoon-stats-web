<template>
  <div>
    <div>
      Date: <date-picker rankingType="x" :defaultYear="year" :defaultMonth="month"
        @time-change="onTimeChange" />
    </div>
    <div>
      Rule: <ranked-rule-picker :defaultRule="rankedRule" noAllRules="true" @rule-change="onRuleChange" />
    </div>

    <table>
      <tr v-for="rankingEntry in ranking" :key="rankingEntry.rank">
        <td>#{{ rankingEntry.rank }}</td>
        <td>
          <div class="weapon-name-container">
            <img class="weapon-icon" :src="rankingEntry.icon">
            <router-link :to="`/players/${rankingEntry.player_id}`">
              <span class="player-name" v-if="'player_name' in rankingEntry">
                {{ rankingEntry.player_name }}
              </span>
              <span class="player-id" v-else>
                {{ rankingEntry.player_id }}
              </span>
            </router-link>
          </div>
        </td>
        <td>{{ rankingEntry.rating }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import moment from 'moment';

import apiClient from '../api-client';
import DatePicker from './DatePicker.vue';
import RankedRulePicker from './RankedRulePicker.vue';
import { findRuleKey, formatRankingEntry } from '../helper';

const lastMonth = moment.utc().add({ month: -1 });

export default {
  name: 'XRankings',
  components: { DatePicker, RankedRulePicker },
  data() {
    return {
      ranking: [],
      year: lastMonth.year(),
      month: lastMonth.month(),
      rankedRule: findRuleKey(1),
    };
  },
  methods: {
      apiClient.get(`/rankings/x/${this.year}/${this.month + 1}/${this.rankedRule}`)
    fetchXRanking() {
        .then((res) => {
          this.ranking = res.data.map(weapon => formatRankingEntry(weapon, 'weapons'));
        })
        .finally(() => {
          this.$router.push('/rankings/x');
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
