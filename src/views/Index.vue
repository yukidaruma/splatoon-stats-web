<template>
  <div>
    <h1 class="title">Splatoon Stats</h1>

    <div class="columns">
      <div class="column is-8 statistics">
        <h2>Dataset</h2>
        <p>
          X Ranked ranking records:
          <strong>{{ stats.x_rankings * 2000 }}</strong>
          of {{ stats.x_rankings }} months
        </p>
        <p>
          League Battle ranking records:
          <strong>{{ stats.league_rankings_estimate }}</strong>
          <small>(estimated; smaller than actual value)</small>
        </p>
        <p>
          Splatfests ranking records:
          <strong>{{ stats.splatfests * 200 }}</strong> of {{ stats.splatfests }} Splatfests
        </p>
      </div>

      <div class="column is-4 about">
        <timeline class="timeline" id="SplatoonStats" sourceType="profile" :options="{ theme: 'dark', tweetLimit: 1 }" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  .timeline {
    max-width: 320px;
  }
}
</style>

<script>
import { Timeline } from 'vue-tweet-embed';

import apiClient from '../api-client';

export default {
  components: { Timeline },
  name: 'Index',
  data() {
    return { stats: {} };
  },
  created() {
    apiClient.get('/stats')
      .then((res) => {
        this.stats = res.data;
      });
  },
};
</script>
