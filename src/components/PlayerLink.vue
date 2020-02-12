<template>
  <span :class="!noHighlight && isFavorited && 'favorited'">
    <router-link v-if="player.name" :to="`/players/${player.id}`" class="player-name">
      {{ player.name }}
    </router-link>
    <router-link v-else :to="`/players/${player.id}`" class="player-id">
      {{ player.id }}
    </router-link>
  </span>
</template>

<style lang="scss" scoped>
.favorited {
  background-color: #f1c40f30;
}
</style>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PlayerLink',
  props: {
    noHighlight: {
      type: Boolean,
      default: false,
    },
    player: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['favoritePlayers']),
    isFavorited() {
      return this.favoritePlayers.some(p => p.id === this.player.id);
    },
  },
};
</script>
