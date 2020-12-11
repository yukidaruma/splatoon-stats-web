<template>
  <div class="is-flex">
    <template v-for="i in length">
      <weapon-picker :key="i" :value.sync="values[i - 1]" hide-button hide-counter single />
    </template>
  </div>
</template>

<script>
import WeaponPicker from './WeaponPicker.vue';

export default {
  components: { WeaponPicker },
  props: {
    length: {
      type: Number,
      required: true,
    },
    value: { type: Array },
  },
  watch: {
    value(value) {
      this.values = value;
    },
    values(value) {
      this.$emit('update:value', value);
    },
    length(value) {
      this.values = new Array(value).fill(0);
    },
  },
  data() {
    return { values: this.value || new Array(this.length).fill(0) };
  },
};
</script>
