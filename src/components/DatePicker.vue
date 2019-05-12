<template>
  <div>
    <select v-model="year" @change="emitYearChange">
      <option :value="yearOption" v-for="yearOption in yearOptions" :key="yearOption"
        :selected="yearOption === year">
        {{ yearOption }}
      </option>
    </select>
    <select v-model="month" @change="emitMonthChange">
      <option v-for="monthOption in monthOptions" :value="monthOption" :key="monthOption"
        :selected="monthOption === month">
        {{ monthOption }}
      </option>
    </select>
    <!-- Todo: change depending on rankingType ({{ rankingType }}) -->
  </div>
</template>

<script>
import moment from 'moment';

const getYearOptions = (startingYear) => {
  return {
    [Symbol.iterator]() {
      const currentYear = moment.utc().year();
      let year = startingYear - 1;

      const iterator = {
        next() {
          year += 1;
          if (year <= currentYear) {
            return { value: year, done: false };
          }
          return { value: undefined, done: true };
        },
      };
      return iterator;
    },
  };
};

const getMonthOptions = (startingYear, startingMonth, includeThisMonth = false) => {
  return {
    [Symbol.iterator]() {
      const now = moment.utc();
      const currentYear = now.year();
      const currentMonth = now.month() + 1;
      const thresholdMonth = includeThisMonth ? currentMonth : currentMonth - 1;
      let month = startingMonth ? startingMonth - 1 : 0;

      const iterator = {
        next() {
          month += 1;
          if (month > 12 || (startingYear === currentYear && month > thresholdMonth)) {
            return { value: undefined, done: true };
          }
          return { value: month, done: false };
        },
      };
      return iterator;
    },
  };
};

export default {
  name: 'LeagueDatePicker',
  props: ['rankingType', 'defaultYear', 'defaultMonth'],
  data() {
    return {
      year: undefined,
      month: undefined,
      yearOptions: [],
      monthOptions: [],
    };
  },
  created() {
    this.year = this.defaultYear;
    this.month = this.defaultMonth;
    this.updateDatePicker();

    this.$watch(
      () => [this.$data.year, this.$data.month],
      (newYear) => {
        this.updateDatePicker(newYear);
      },
    );
  },
  methods: {
    emitYearChange() {
      this.$emit('year-change', this.year);
    },
    emitMonthChange() {
      this.$emit('month-change', this.month);
    },
    updateDatePicker() {
      const startingMonth = this.rankingType === 'x' && this.year === 2018 ? 5
                          : this.rankingType === 'league' && this.year === 2017 ? 7
                          : 1;
      const monthOptions = Array.from(getMonthOptions(this.year, startingMonth, this.rankingType === 'league'));

      // Note that it should be getYearOptions(2017) for league.
      this.yearOptions = getYearOptions(2018);
      this.monthOptions = monthOptions;

      // Set to last month of if the option is unavailable
      if (!monthOptions.includes(this.month)) {
        this.month = monthOptions[monthOptions.length - 1];
        this.emitMonthChange();
      }
    },
  },
};
</script>

<style scoped>
div {
  display: inline;
}
</style>
