<template>
  <span
    @mouseover="setFocusedPlayerId(player.id)"
    @mouseleave="unsetFocusedPlayerId"
    :class="spanClasses"
  >
    <router-link v-if="player.name" :to="`/players/${player.id}`" class="player-name">
      {{ player.name }}
    </router-link>
    <router-link v-else :to="`/players/${player.id}`" class="player-id">
      {{ player.id }}
    </router-link>
  </span>
</template>

<style lang="scss" scoped>
.is-favorited {
  background-color: #f1c40f40;
}

.has-highlight {
  background-color: #f2660f40;
}
</style>

<script>
import { mapState, mapActions } from 'vuex';

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
    ...mapState(['favoritePlayers', 'focusedPlayerId']),
    isFavorited() {
      return this.favoritePlayers.some(p => p.id === this.player.id);
    },
    spanClasses() {
      const classNames = [];

      if (!this.noHighlight && this.isFavorited) {
        classNames.push('is-favorited');
      }

      if (this.focusedPlayerId === this.player.id) {
        classNames.push('has-highlight');
      }

      return classNames;
    },
  },
  methods: {
    ...mapActions(['setFocusedPlayerId', 'unsetFocusedPlayerId']),
    getClasses(className) {
      return [
        className,
        this.player.id === this.focusedPlayerId ? 'has-highlight' : '',
      ];
    },
  },
};
</script>
