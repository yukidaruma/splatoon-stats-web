import moment from 'moment';
import { Line } from 'vue-chartjs';
import { findRuleKey } from '../helper';

const RULE_COUNT = 4;

export const chartColors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f'];

export default {
  name: 'PlayerSummaryXRankedChart',
  extends: Line,
  props: ['chartType', 'data', 'options', 'ruleFilters', 'showLine'],
  computed: {
    chartData() {
      this.showXPowerChart = true;
      const firstAppeared = moment(this.data[this.data.length - 1].start_time);
      const lastAppeared = moment(this.data[0].start_time);
      const months = 1 + lastAppeared.diff(firstAppeared, 'month');
      const datasets = new Array(RULE_COUNT).fill(null).map((_v, i) => {
        const dataset = {};
        const ruleId = i + 1;
        dataset.fill = false;
        dataset.label = this.$t(`rules.${findRuleKey(ruleId)}`);
        dataset.borderColor = chartColors[i];
        dataset.backgroundColor = chartColors[i];
        dataset.showLine = this.showLine;
        dataset.hidden = !this.ruleFilters.includes(i + 1);
        if (this.data.some((row) => ruleId === row.rule_id)) {
          dataset.data = new Array(months).fill(null);
        }
        return dataset;
      });
      const xAxesLabels = [];
      [...Array(months)].map((_, i) => {
        xAxesLabels.push(firstAppeared.clone().add({ month: i }).format('YY-MM'));
      });

      const chartData = {
        datasets,
        labels: xAxesLabels,
      };

      Array.from(this.data).reverse().forEach((row) => {
        const i = moment(row.start_time).diff(firstAppeared, 'month');
        if (this.chartType === 'power') {
          datasets[row.rule_id - 1].data[i] = row.rating;
        } else if (this.chartType === 'rank') {
          datasets[row.rule_id - 1].data[i] = row.rank;
        }
      });

      return chartData;
    },
    chartOptions() {
      const defaultLegendClickHandler = Chart.defaults.global.legend.onClick;
      const component = this;
      const toggleItem = (arr, item) => (arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
      const customLegendClickHandler = function _(e, legendItem) {
        const ruleId = legendItem.datasetIndex + 1;
        defaultLegendClickHandler.call(this, e, legendItem);
        component.$emit('update:rule-filters', toggleItem(component.ruleFilters, ruleId));
      };

      const options = {
        ...this.options,
        legend: { onClick: customLegendClickHandler },
      };

      if (this.chartType === 'rank') {
        return {
          ...options,
          scales: { yAxes: [{ ticks: { reverse: true } }] },
        };
      }
      return options;
    },
  },
  methods: {
    updateChart() {
      this.renderChart(this.chartData, this.chartOptions);
    },
  },
  mounted() {
    this.updateChart();
    this.$watch(
      () => [this.chartType, this.data, this.options, this.showLine],
      this.updateChart,
    );
  },
  watch: {
    ruleFilters() {
      this.updateChart();
    },
  },
};
