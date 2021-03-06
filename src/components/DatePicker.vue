<template>
  <div>
    <select v-model="year" @change="onDatePickerChange()">
      <option :value="yearOption" v-for="yearOption in yearOptions" :key="yearOption"
        :selected="yearOption === year">
        {{ yearOption }}
      </option>
    </select>
    <select v-model="month" @change="onDatePickerChange()">
      <option v-for="monthOption in monthOptions" :value="monthOption.value" :key="monthOption.value"
        :selected="monthOption.value === month">
        {{ monthOption.text }}
      </option>
    </select>

    <div v-if="rankingType === 'league' && showDate">
      <select v-model="date" @change="onDatePickerChange()">
        <option v-for="dateOption in dateOptions" :value="dateOption" :key="dateOption"
          :selected="dateOption === date">
          {{ dateOption }}
        </option>
      </select>
      <select v-model="hour" @change="onDatePickerChange(false)"><!-- Changing hour won't update options -->
        <option v-for="hourOption in hourOptions" :value="hourOption" :key="hourOption"
          :selected="hourOption === hour">
          {{ hourOption }}
        </option>
      </select>

      ({{ localLeagueTime({ year, month, date, hour }) }} in your local time)
    </div>
  </div>
</template>

<script>
import moment from 'moment';

const getDatePickerOptions = (starting, ending, year, month, date) => {
  const startingYear = starting.year();
  const startingMonth = starting.month();
  const startingDate = starting.date();

  const yearOptions = {
    [Symbol.iterator]() {
      let yearOption = startingYear - 1;
      const iterator = {
        next() {
          yearOption += 1;
          if (moment({ year: yearOption }) > ending) {
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
      let monthOption = (year === startingYear ? startingMonth : 0) - 1;
      const iterator = {
        next() {
          monthOption += 1;
          if (moment.utc({ year, month: monthOption }) > ending || monthOption > 11) {
            return { value: undefined, done: true };
          }
          return { value: { value: monthOption, text: monthOption + 1 }, done: false };
        },
      };
      return iterator;
    },
  };

  const dateOptions = {
    [Symbol.iterator]() {
      const lastDateOfMonth = moment.utc({ year, month }).endOf('month').date();
      let dateOption = (year === startingYear && month === startingMonth ? startingDate : 1) - 1;

      const iterator = {
        next() {
          dateOption += 1;
          if (moment.utc({ year, month, date: dateOption }) > ending || dateOption > lastDateOfMonth) {
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
          if (moment.utc({
            year, month, date, hour: hourOption,
          }) > ending || hourOption >= 24) {
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
  name: 'DatePicker',
  props: ['initialRankingType', 'showDate', 'value'],
  computed: {
    time() {
      return moment.utc({
        year: this.year,
        month: this.month,
        date: this.date,
        hour: this.hour,
      });
    },
  },
  data() {
    return {
      rankingType: undefined,
      year: null,
      month: null,
      date: null,
      hour: null,
      yearOptions: [],
      monthOptions: [],
      dateOptions: [],
      hourOptions: [],
    };
  },
  created() {
    this.rankingType = this.initialRankingType;
    this.updateSelectedDate(this.value);
    this.updateDatePicker();
  },
  methods: {
    localLeagueTime(time) {
      const start = moment.utc(time).local();
      const end = start.clone().add({ hour: 2 });
      return `${start.format('MM-DD HH:mm')}~${end.format('HH:mm')}`;
    },
    updateSelectedDate(newSelectedDate) {
      const now = moment.utc();

      if (newSelectedDate > now) {
        newSelectedDate = now;
      }

      this.year = newSelectedDate.year();
      this.month = newSelectedDate.month();
      this.date = newSelectedDate.date();
      this.hour = newSelectedDate.hour();
    },
    onDatePickerChange(updateDatePicker = true) {
      if (updateDatePicker) {
        this.updateDatePicker();
      }

      this.$emit('input', this.time);
    },
    updateDatePicker(newRankingType) {
      let startingYear; let startingMonth; let startingDate; let
        ending;
      const now = moment.utc();

      if (newRankingType) {
        this.rankingType = newRankingType;
      }

      if (this.rankingType === 'x') {
        startingYear = 2018;
        startingMonth = 4;
        ending = now.add({ month: -1 });
      } else {
        // Should be 2017/7/21
        startingYear = 2018;
        startingMonth = 0;
        startingDate = 1;
        ending = now;
      }

      const starting = moment.utc({ year: startingYear, month: startingMonth, date: startingDate });

      const datePickerOptions = getDatePickerOptions(starting, ending, this.year, this.month, this.date);
      const { yearOptions, monthOptions, dateOptions, hourOptions } = datePickerOptions;
      this.yearOptions = yearOptions;
      this.monthOptions = monthOptions;
      this.dateOptions = dateOptions;
      this.hourOptions = hourOptions;

      let newSelectedDate;

      // Update selected date to latest available date if not available
      if (!monthOptions.some((monthOption) => monthOption.value === this.month)) {
        newSelectedDate = moment.utc({
          year: this.year,
          month: monthOptions[monthOptions.length - 1].value,
        });
      }

      if (this.rankingType === 'league') {
        if (!dateOptions.includes(this.date)) {
          newSelectedDate = moment.utc({
            year: this.year,
            month: this.month,
            date: dateOptions[dateOptions.length - 1],
          });
        }
        if (!hourOptions.includes(this.hour)) {
          newSelectedDate = moment.utc({
            year: this.year,
            month: this.month,
            date: this.date,
          });
        }
      }

      if (newSelectedDate) {
        this.updateSelectedDate(newSelectedDate);
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
