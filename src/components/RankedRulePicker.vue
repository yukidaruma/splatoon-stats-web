<template>
  <select v-model="rankedRule" @change="emitRuleChange">
    <!-- Todo: disable and show "Turf wan" when splatfest -->
    <option :value="null" v-if="!noAllRules">All</option>
    <option value="splat_zones">Splat Zones</option>
    <option value="tower_control">Tower Control</option>
    <option value="rainmaker">Rainmaker</option>
    <option value="clam_blitz">Clam Blitz</option>
  </select>
</template>

<script>
export default {
  name: 'RankedRulePicker',
  props: ['defaultRule', 'noAllRules'],
  data() {
    return {
      rankedRule: null,
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
