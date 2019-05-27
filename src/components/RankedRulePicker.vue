<template>
  <select v-model="rankedRule" @change="emitRuleChange">
    <!-- Todo: disable and show "Turf wan" when splatfest -->
    <option :value="null" v-if="!noAllRules">All</option>
    <option v-for="r in rankedRules" :key="r.id" :value="r.key">{{ $t(`rules.${r.key}.name`) }}</option>
  </select>
</template>

<script>
import { rankedRules } from '../helper';

export default {
  name: 'RankedRulePicker',
  props: ['defaultRule', 'noAllRules'],
  data() {
    return {
      rankedRule: null,
      rankedRules: rankedRules,
    };
  },
  created() {
    this.rankedRule = this.defaultRule;
  },
  methods: {
    emitRuleChange() {
      this.$emit('rule-change', this.rankedRule);
    },
  },
};
</script>
