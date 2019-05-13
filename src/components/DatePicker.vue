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

    <div v-if="rankingType === 'league'">
      <select v-model="date" @change="emitDateChange">
        <option v-for="dateOption in dateOptions" :value="dateOption" :key="dateOption"
          :selected="dateOption === date">
          {{ dateOption }}
        </option>
      </select>
      <select v-model="hour" @change="emitHourChange">
        <option v-for="hourOption in hourOptions" :value="hourOption" :key="hourOption"
          :selected="hourOption === hour">
          {{ hourOption }}
        </option>
      </select>
    </div>
    <!-- Todo: change depending on rankingType ({{ rankingType }}) -->
  </div>
</template>

<script>
import moment from 'moment';

const getDatePickerOptions = (starting, ending, year, month, date, hour) => {
  const startingYear = starting.year();
  const startingMonth = starting.month();
  const startingDate = starting.date();

  const yearOptions = {
    [Symbol.iterator]() {
      let yearOption = startingYear - 1;
      const iterator = {
        next() {
          yearOption += 1;
          if (moment({ year: yearOption}) > ending) {
            return { value: undefined, done: true };
          }
          return { value: yearOption, done: false };
        },
      };
      return iterator;
    },
  };

  const monthOptions = {
    [Symbol.iterator]() {
      let monthOption = year === startingYear ? startingMonth : 0;
      const iterator = {
        next() {
          monthOption += 1;
          if (moment.utc({ year, month: monthOption - 1 }) > ending || monthOption > 12) {
            return { value: undefined, done: true };
          }
          return { value: monthOption, done: false };
        },
      };
      return iterator;
    },
  };

  const dateOptions = {
    [Symbol.iterator]() {
      const lastDateOfMonth = moment.utc({ year, month: month - 1 }).endOf('month').date();
      let dateOption = year === startingYear && month === startingMonth ? startingDate - 1 : 0;

      const iterator = {
        next() {
          dateOption += 1;
          if (moment.utc({ year, month: month - 1, date: dateOption }) > ending || dateOption > lastDateOfMonth) {
            return { value: undefined, done: true };
          }
          return { value: dateOption, done: false };
        },
      };
      return iterator;
    },
  };

  const hourOptions = {
    [Symbol.iterator]() {
      let hourOption = -2;

      const iterator = {
        next() {
          hourOption += 2;
          if (moment.utc({ year, month: month - 1, date, hour: hourOption }) > ending || hourOption >= 24) {
            return { value: undefined, done: true };
          }
          return { value: hourOption, done: false };
        },
      };
      return iterator;
    },
  };

  return {
    yearOptions: Array.from(yearOptions),
    monthOptions: Array.from(monthOptions),
    dateOptions: Array.from(dateOptions),
    hourOptions: Array.from(hourOptions),
  };
};

export default {
  name: 'LeagueDatePicker',
  props: ['rankingType', 'defaultYear', 'defaultMonth', 'defaultDate', 'defaultHour'],
  data() {
    return {
      year: undefined,
      month: undefined,
      date: undefined,
      hour: undefined,
      yearOptions: [],
      monthOptions: [],
      dateOptions: [],
      hourOptions: [],
    };
  },
  created() {
    let defaultDate = moment.utc({ year: this.defaultYear, month: this.defaultMonth - 1, date: this.defaultDate, hour: this.defaultHour });
    this.updateSelectedDate(defaultDate);
    this.updateDatePicker();

    this.$watch(
      // You don't have to watch hour because it won't change options.
      () => [this.$data.year, this.$data.month, this.$data.date],
      (newYear) => {
        this.updateDatePicker();
      },
    );
  },
  methods: {
    emitYearChange() { this.$emit('year-change', this.year); },
    emitMonthChange() { this.$emit('month-change', this.month); },
    emitDateChange() { this.$emit('date-change', this.date); },
    emitHourChange() { this.$emit('hour-change', this.hour); },
    updateSelectedDate(newSelectedDate) {
      const now = moment.utc();

      if (newSelectedDate > now) {
        newSelectedDate = now;
      }

      this.year = newSelectedDate.year();
      this.month = newSelectedDate.month() + 1;
      this.date = newSelectedDate.date();
      this.hour = 0;
    },
    updateDatePicker() {
      let startingYear, startingMonth, startingDate, ending;
      const now = moment.utc();

      if (this.rankingType === 'x') {
        startingYear = 2018;
        startingMonth = 5;
        ending = now.add({ month: -1 });
      } else {
        // Should be 2017/7/21
        startingYear = 2018;
        startingMonth = 1;
        startingDate = 1;
        ending = now;
      }

      const starting = moment.utc({ year: startingYear, month: startingMonth - 1, date: startingDate });

      const datePickerOptions = getDatePickerOptions(starting, ending, this.year, this.month, this.date);
      const { yearOptions, monthOptions, dateOptions, hourOptions } = datePickerOptions;
      this.yearOptions = yearOptions;
      this.monthOptions = monthOptions;
      this.dateOptions = dateOptions;
      this.hourOptions = hourOptions;

      // Update selected date to latest available date if not available
      if (!monthOptions.includes(this.month)) {
        this.updateSelectedDate(moment.utc({
          year: this.year,
          month: monthOptions[monthOptions.length - 1],
        }));
      } else if (!dateOptions.includes(this.date)) {
        this.updateSelectedDate(moment.utc({
          year: this.year,
          month: this.month - 1,
          date: dateOptions[dateOptions.length - 1],
        }));
      } else if (!hourOptions.includes(this.hour)) {
        this.updateSelectedDate(moment.utc({
          year: this.year,
          month: this.month - 1,
          date: this.date,
        }));
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
