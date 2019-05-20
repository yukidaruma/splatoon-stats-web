import { Line } from 'vue-chartjs';

export default {
  name: 'PlayerSummaryXRankedChart',
  extends: Line,
  props: ['data', 'options'],
  mounted() {
    this.renderChart(this.data, this.options);
    this.$watch(
      () => [this.$data.data, this.$data.options],
      () => { this.renderChart(this.data, this.options); },
    );
  },
};
