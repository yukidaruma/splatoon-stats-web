<template>
  <div>
    <h1>Splatoon Stats</h1>
    <h2>Dataset</h2>
    <p>X Ranked ranking records: <strong>{{ stats.x_rankings * 2000 }}</strong> of {{ stats.x_rankings }} months</p>
    <p>League Battle ranking records: <strong>{{ stats.league_rankings_estimate }}</strong> <small>(estimated; smaller than actual value)</small></p>
    <p>Splatfests ranking records: <strong>{{ stats.splatfests * 200 }}</strong> of {{ stats.splatfests }} Splatfests</p>
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
