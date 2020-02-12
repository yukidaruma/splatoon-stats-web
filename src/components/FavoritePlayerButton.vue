<template>
  <span v-if="isFavorited" class="favorited" @click="toggleFavorite">
    ★
  </span>
  <span v-else @click="toggleFavorite">
    ☆
  </span>
</template>

<style lang="scss" scoped>
span {
  &.favorited {
    color: #f1c40f;
  }
  &:not(.favorited) {
  }
}
</style>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
  },
  computed: {
    ...mapState(['favoritePlayers']),
    isFavorited() {
      return this.favoritePlayers.some(p => p.id === this.id);
    },
  },
  methods: {
    toggleFavorite() {
      const player = { id: this.id };

      if (this.name) {
        player.name = this.name;
      }

      this.$store.dispatch(
        this.isFavorited ? 'removeFavoritePlayer' : 'addFavoritePlayer',
        player,
      );
    },
  },
}
</script>
