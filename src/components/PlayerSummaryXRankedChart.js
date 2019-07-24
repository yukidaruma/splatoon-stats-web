import { Line } from 'vue-chartjs';
import moment from 'moment';
import { findRuleKey } from '../helper';

export default {
  name: 'PlayerSummaryXRankedChart',
  extends: Line,
  props: ['chartType', 'data', 'options'],
  computed: {
    chartData() {
      this.showXPowerChart = true;
      const chartColors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f'];
      const firstAppeared = moment(this.data[this.data.length - 1].start_time);
      const lastAppeared = moment(this.data[0].start_time);
      const months = 1 + lastAppeared.diff(firstAppeared, 'month');
      const datasets = new Array(4).fill(null).map((_v, i) => {
        const dataset = {};
        const ruleId = i + 1;
        dataset.fill = false;
        dataset.label = this.$t(`rules.${findRuleKey(ruleId)}.name`);
        dataset.borderColor = chartColors[i];
        dataset.backgroundColor = chartColors[i];
        if (this.data.some(row => ruleId === row.rule_id)) {
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
      if (this.chartType === 'rank') {
        return Object.assign({
          scales: {
            yAxes: [{
              ticks: {
                reverse: true,
              },
            }],
          },
        }, this.options);
      }
      return this.options;
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
      () => [this.data, this.options, this.chartType],
      this.updateChart,
    );
  },
};
