import { Bar } from 'vue-chartjs';

const sumByCriteria = (data, criteria) => {
  const aggregated = {};

  data.forEach((item) => {
    const [key, value] = criteria(item);

    aggregated[key] = (aggregated[key] ?? 0) + value;
  });

  return aggregated;
};

/** @type {import('vue').default} */
const DistributionChart = {
  name: 'DistributionChart',
  extends: Bar,
  props: ['color', 'data', 'interval', 'title', 'total'],
  computed: {
    chartData() {
      const distributions = sumByCriteria(
        Object.entries(this.data.distributions),
        ([key, value]) => {
          const rating = Number(key);
          return [rating - (rating % this.interval), value];
        },
      );
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
            data: data.map((item) => ((this.total - item.accumlativeValue) / this.total) * 100),
            borderColor: 'white',
            type: 'line',
            yAxisID: 'accumulatedPercentage',
          },
          {
            data,
            backgroundColor: this.color,
            borderColor: this.color,
            yAxisID: 'players',
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
        scales: {
          yAxes: [
            { id: 'accumulatedPercentage', ticks: { max: 100 }, position: 'right' },
            { id: 'players', ticks: { suggestedMin: 0 } },
          ],
        },
      };
    },
  },
  methods: {
    render() {
      this.renderChart(this.chartData, this.chartOptions);
    },
  },
  mounted() {
    this.$watch(() => [this.data, this.interval, this.title], this.render, { immediate: true });
  },
};

export default DistributionChart;
