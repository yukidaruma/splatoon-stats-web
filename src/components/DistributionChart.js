import { Bar } from 'vue-chartjs';

/** @type {import('vue').default} */
const DistributionChart = {
  name: 'DistributionChart',
  extends: Bar,
  props: ['color', 'data', 'title'],
  computed: {
    chartData() {
      const { distributions } = this.data;
      const labels = Object.keys(distributions);
      const accumulativeDistributions = Object.values(distributions);
      const data = accumulativeDistributions.map((count, i) => {
        let y = count;
        if (i <= accumulativeDistributions.length) {
          y -= accumulativeDistributions[i + 1];
        }
        return { y, accumlativeValue: count };
      });

      /** @type {Chart.ChartData} */
      const chartData = {
        datasets: [
          {
            data,
            backgroundColor: this.color,
            borderColor: this.color,
          },
        ],
        labels,
      };

      return chartData;
    },
    /** @returns {Chart.ChartOptions} */
    chartOptions() {
      return {
        legend: { display: false },
        tooltips: {
          callbacks: {
            label(item, chartData) {
              const itemData = chartData.datasets[item.datasetIndex].data[item.index];
              return `${item.value} (${itemData.accumlativeValue})`;
            },
          },
        },
        scales: { yAxes: [{ ticks: { suggestedMin: 0 } }] },
      };
    },
  },
  methods: {
    render() {
      this.renderChart(this.chartData, this.chartOptions);
    },
  },
  mounted() {
    this.$watch(() => [this.data, this.title], this.render, { immediate: true });
  },
};

export default DistributionChart;
