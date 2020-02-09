<template>
  <div v-if="weapons.length">
    <button @click="openModal">Open</button>
    ({{selectedWeapons.length}}/{{weapons.length}})

    <div :class="['modal', isOpen ? 'is-active' : '']">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="modal-controls">
          <button v-if="showSelectAll" @click="selectAll">Select All</button>
          <button v-else @click="unselectAll">Unselect All</button>
          <button class="red" @click="closeModal">Close</button>
        </div>

        <span v-for="weapon in weapons" :key="weapon.weapon_id">
          <img
            @click="toggleSelection(weapon.weapon_id)"
            :class="['weapon-icon', selectedWeapons.includes(weapon.weapon_id) ? 'is-selected' : '']"
            :alt="$t(`weapons.${weapon.weapon_id}.name`)"
            :title="$t(`weapons.${weapon.weapon_id}.name`)"
            :src="weaponIcon('weapons', weapon.weapon_id)"
          >
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-controls {
  display: flex;
  justify-content: space-between;
}

img {
  margin: 8px;
  &:not(.is-selected) {
    filter: grayscale(1);
    opacity: .5;
  }
}
</style>

<script>
import { mapState } from 'vuex';
import { weaponIcon } from '../helper';

export default {
  computed: {
    ...mapState(['weapons']),
    showSelectAll() {
      return this.selectedWeapons.length < this.weapons.length;
    },
  },
  props: ['value'],
  data() {
    return {
      isOpen: false,
      selectedWeapons: [],
    };
  },
  methods: {
    weaponIcon,
    closeModal() {
      this.isOpen = false;
    },
    openModal() {
      this.isOpen = true;
    },
    selectAll() {
      this.selectedWeapons = this.weapons.map(w => w.weapon_id);
    },
    toggleSelection(weaponId) {
      if (this.selectedWeapons.includes(weaponId)) {
        this.selectedWeapons = this.selectedWeapons.filter(w => w !== weaponId);
        return;
      }
      this.selectedWeapons.push(weaponId);
    },
    unselectAll() {
      this.selectedWeapons = [];
    },
  },
  watch: {
    selectedWeapons() {
      this.$emit('input', this.selectedWeapons);
    },
  },
  async mounted() {
    await this.$store.dispatch('getWeapons');

    this.selectAll();
  },
};
</script>
