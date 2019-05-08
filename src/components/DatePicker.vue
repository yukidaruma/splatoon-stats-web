<template>
  <div>
    <select v-model="year" @change="emitYearChange">
      <option :value="yearOption.year" v-for="yearOption in yearOptions" :key="yearOption.key" :selected="yearOption.year === year">{{ yearOption.year }}</option>
    </select>
    <select v-model="month" @change="emitMonthChange">
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <!-- Todo: change depending on rankingType ({{ rankingType }}) -->
  </div>
</template>

<script>
export default {
  name: 'LeagueDatePicker',
  props: ['rankingType', 'defaultYear', 'defaultMonth'],
  data() {
    return {
      year: undefined,
      month: undefined,
      yearOptions: [],
    };
  },
  created() {
    this.year = this.defaultYear;
    this.month = this.defaultMonth;
    this.updateDatePicker();
  },
  methods: {
    emitYearChange() {
      this.$emit('year-change', this.year);
    },
    emitMonthChange() {
      this.$emit('month-change', this.month);
    },
    updateDatePicker() {
      if (this.rankingType === 'x') {
        this.yearOptions = [2017, 2018, 2019].map((year) => {
          return { year, key: year };
        });
      } else { // league

      }

      // If out of date, set to latest available date
    },
  },
};
</script>

<style scoped>
div {
  display: inline;
}
</style>
