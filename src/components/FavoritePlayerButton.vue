<template>
  <span class="button" v-if="isFavorited" @click="toggleFavorite">
    <span :class="starClasses">★</span> Remove from Favorite Players
  </span>
  <span class="button" v-else @click="toggleFavorite">
    <span :class="starClasses">☆</span> Add to Favorite Players
  </span>
</template>

<style lang="scss" scoped>
@import '@/assets/global-variables.scss';

.button {
  display: inline-block;
  padding: .25em 1em;
  border-radius: 8px;
  border: 1px solid $body-color;
}
.star.favorited {
  color: #f1c40f;
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
    name: { type: String },
  },
  computed: {
    ...mapState(['favoritePlayers']),
    isFavorited() {
      return this.favoritePlayers.some((p) => p.id === this.id);
    },
    starClasses() {
      return { star: true, favorited: this.isFavorited };
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
};
</script>
