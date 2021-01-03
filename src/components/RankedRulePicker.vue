<template>
  <div class="checkboxes" v-if="inputType === RankedRulePickerTypes.checkbox">
    <label v-for="r in rankedRules" :key="r.id" class="checkbox">
      <input
        :value="r.id"
        type="checkbox"
        v-model="selectedRules"
        @change="$emit('input', asId ? r.id : selectedRules)"
      />{{ $t(`ui.rule_shortnames.${r.key}`) }}</label
    >
  </div>
  <select v-else v-model="rankedRule" @input="$emit('input', $event.target.value)">
    <!-- Todo: disable and show "Turf wan" when splatfest -->
    <option :value="null" v-if="!noAllRules">All</option>
    <option v-for="r in rankedRules" :key="r.id" :value="asId ? r.id : r.key">{{
      $t(`rules.${r.key}`)
    }}</option>
  </select>
</template>

<script>
import { rankedRules } from '../helper';

export const DefaultSelectedRules = { all: rankedRules.map((rule) => rule.id) };

export const RankedRulePickerTypes = {
  select: 1, // default
  checkbox: 2,
};

export default {
  name: 'RankedRulePicker',
  props: {
    noAllRules: Boolean,
    type: Number,
    value: [String, Number],
    asId: Boolean,
  },
  computed: {
    inputType() {
      // Make sure to type is valid value.
      if (this.$props.type === RankedRulePickerTypes.checkbox) {
        return RankedRulePickerTypes.checkbox;
      }

      return RankedRulePickerTypes.select;
    },
  },
  data() {
    return {
      rankedRule: null,
      rankedRules,
      RankedRulePickerTypes,
      selectedRules: [],
    };
  },
  created() {
    const initialValue = this.value;

    switch (this.inputType) {
      case RankedRulePickerTypes.checkbox:
        if (Array.isArray(initialValue)) {
          this.selectedRules = initialValue;
        }
        break;
      default:
        if (initialValue) {
          this.rankedRule = this.value;
        }
    }
  },
  watch: {
    value() {
      this.selectedRules = this.value;
    },
  },
};
</script>
