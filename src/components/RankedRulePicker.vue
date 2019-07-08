<template>
  <select v-model="rankedRule" @input="$emit('input', $event.target.value)">
    <!-- Todo: disable and show "Turf wan" when splatfest -->
    <option :value="null" v-if="!noAllRules">All</option>
    <option v-for="r in rankedRules" :key="r.id" :value="r.key">{{ $t(`rules.${r.key}.name`) }}</option>
  </select>
</template>

<script>
import { rankedRules } from '../helper';

export default {
  name: 'RankedRulePicker',
  props: ['value', 'noAllRules'],
  data() {
    return {
      rankedRule: null,
      rankedRules: rankedRules,
    };
  },
  created() {
    if (this.value) {
      this.rankedRule = this.value;
    }
  },
};
</script>
