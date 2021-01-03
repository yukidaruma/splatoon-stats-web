import { Bar } from 'vue-chartjs';

const groupByCriteria = (data, criteria) => {
  const aggregated = {};

  data.forEach((item) => {
    const [key, value] = criteria(item);
    if (aggregated[key]) return;

    aggregated[key] = value;
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
      const distributions = groupByCriteria(
        Object.entries(this.data.distributions),
        ([realKey, value]) => {
          const rating = Number(realKey);
          const key = rating - (rating % this.interval);
          return [key, value];
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
            lineTension: 0,
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
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label(item, chartData) {
              const percentile = Number.parseFloat(chartData.datasets[0].data[item.index]).toFixed(
                2,
              );

              switch (item.datasetIndex) {
                case 0:
                  return `${percentile}%`;
                case 1: {
                  const itemData = chartData.datasets[item.datasetIndex].data[item.index];
                  return `${item.value} (${itemData.accumlativeValue}; Top ${(
                    100 - percentile
                  ).toFixed(2)}%)`;
                }
                default:
              }
            },
          },
        },
        scales: {
          yAxes: [
            {
              id: 'accumulatedPercentage',
              ticks: { max: 100, stepSize: 20 },
              gridLines: { color: 'transparent' },
              position: 'right',
            },
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
