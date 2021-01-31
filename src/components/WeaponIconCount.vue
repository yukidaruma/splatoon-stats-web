<template>
  <div :class="noMargin ? 'no-margin is-flex' : null">
    <img
      :class="['weapon-icon', isActive ? 'is-active' : '']"
      :alt="$t(`weapons.${weaponId}`)"
      :title="$t(`weapons.${weaponId}`)"
      :src="weaponIcon('weapons', weaponId)"
    />
    <span v-if="count" class="count">{{ count }}</span>
  </div>
</template>

<script>
import { weaponIcon } from '../helper';

export default {
  props: {
    count: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    weaponId: {
      type: Number,
      required: true,
    },
    noMargin: Boolean,
  },
  methods: { weaponIcon },
};
</script>

<style lang="scss" scoped>
div:not(.no-margin) {
  margin: 8px;
  width: 32px;
  height: 32px;
  display: inline-block;
  position: relative;
}
img {
  position: static;
  &:not(.is-active) {
    filter: grayscale(1);
    opacity: .5;
  }
}
.count {
  font-size: 80%;
  line-height: 1.5em;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0 .125em;
  background-color: rgba(0,0,0,0.5);
  color: white;
}
</style>
