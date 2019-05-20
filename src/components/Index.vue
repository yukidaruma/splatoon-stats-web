<template>
  <div>
    <h1>Splatoon Stats</h1>
    <h2>Dataset</h2>
    <p>X Ranked Battles: <strong>{{ stats.x_rankings * 2000 }}</strong> of {{ stats.x_rankings }} months</p>
    <p>League Battles: <strong>{{ stats.league_rankings_estimate }}</strong> <small>(estimated; smaller than actual value)</small></p>
    <p>Splatfests: <strong>{{ stats.splatfests }}</strong></p>
  </div>
</template>

<script>
import apiClient from '../api-client';

export default {
  name: 'Index',
  data() {
    return {
      stats: {},
    };
  },
  created() {
    apiClient.get('/stats')
      .then((res) => {
        this.stats = res.data;
      });
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
