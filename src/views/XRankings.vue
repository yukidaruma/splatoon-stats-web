<template>
  <div>
    <h1 class="title">X Rankings</h1>

    <div class="controls">
      <div>
        <span class="label">Date</span>
        <date-picker initialRankingType="x" v-model="time" />
      </div>
      <div>
        <span class="label">Rule</span>
        <ranked-rule-picker v-model="rankedRule" :value="rankedRule" noAllRules="true" />
        <button @click="fetchXRanking" :disabled="isLoading">Go</button>
      </div>
    </div>

    <div v-if="title">
      <h2 class="title table-title">
        X Ranking for {{ title.year }}-{{ title.month }} {{ $t(`rules.${title.rankedRule}.name`) }}
      </h2>
      <p class="weapon-popularity-link">
        <router-link :to="weaponPopularityPagePath">
          Most used weapons for X Ranked {{ $t(`rules.${title.rankedRule}.name`) }} in {{ title.year }}-{{ title.month }}
        </router-link>
      </p>
    </div>
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
  props: ['initialYear', 'initialMonth', 'initialRankedRule'],
  data() {
    return {
      ranking: [],
      isLoading: false,
      time: null,
      rankedRule: undefined,
      title: null,
    };
  },
  computed: {
    year() {
      return this.time.year();
    },
    month() {
      return this.time.month();
    },
    weaponPopularityPagePath() {
      if (this.title) {
        return `/weapons/weapons/x/${this.title.year}/${this.title.month}/${this.title.rankedRule}`;
      }
    },
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
  },
  created() {
    // You can assume year and month are valid, too, if initialRankedRule is valid
    if (this.initialRankedRule) {
      this.time = moment.utc({
        year: this.initialYear,
        month: this.initialMonth - 1,
      });
      this.rankedRule = this.initialRankedRule;
    } else {
      const lastMonth = moment.utc().add({ month: -1 });
      this.time = lastMonth;
      this.rankedRule = findRuleKey(1);
    }

    this.fetchXRanking();
  },
};
</script>