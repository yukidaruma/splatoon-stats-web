<template>
  <div>
    <template v-if="weapons.length === 0">
      <button @click="openModal" disabled>Open</button>
    </template>
    <template v-else>
      <button @click="openModal">Open</button>
      ({{selectedWeapons.length}}/{{weapons.length}})
    </template>

    <div :class="['modal', isOpen ? 'is-active' : '']">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="modal-controls">
          <button v-if="!isAllSelected" @click="selectAll">Select All</button>
          <button v-else @click="unselectAll">Unselect All</button>
          <button class="red" @click="closeModal">Close</button>
        </div>

        <div class="weapon-icon-container" v-for="weapon in weapons" :key="weapon.weapon_id" @click="toggleSelection(weapon.weapon_id)">
          <img
            :class="['weapon-icon', selectedWeapons.includes(weapon.weapon_id) ? 'is-selected' : '']"
            :alt="$t(`weapons.${weapon.weapon_id}.name`)"
            :title="$t(`weapons.${weapon.weapon_id}.name`)"
            :src="weaponIcon('weapons', weapon.weapon_id)"
          >
          <span v-if="counts[weapon.weapon_id]" class="count">{{ counts[weapon.weapon_id] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-controls {
  display: flex;
  justify-content: space-between;
}

img:not(.is-selected) {
  filter: grayscale(1);
  opacity: .5;
}

.weapon-icon-container {
  margin: 8px;
  width: 32px;
  height: 32px;
  display: inline-block;
  position: relative;
}
img {
  position: static;
}
.count {
  font-size: 80%;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0 .125em;
  background-color: rgba(0,0,0,0.5);
  color: white;
}
</style>

<script>
import { mapState } from 'vuex';
import { weaponIcon } from '../helper';

export default {
  computed: {
    ...mapState({
      allWeapons(state) {
        return state.weapons;
      },
    }),
    isAllSelected() {
      return this.selectedWeapons.length === this.weapons.length;
    },
    weapons() {
      if (this.options) {
        return this.allWeapons.filter(w => this.options.includes(w.weapon_id));
      }
      return this.allWeapons;
    },
  },
  props: ['options', 'value', 'counts'],
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
    initialize() {
      this.selectAll();
    },
    unselectAll() {
      this.selectedWeapons = [];
    },
  },
  watch: {
    selectedWeapons() {
      if (this.isAllSelected) {
        // Emits null instead of full array for faster filtering.
        this.$emit('input', null);
        return;
      }
      this.$emit('input', this.selectedWeapons);
    },
    options() {
      this.initialize();
    },
  },
  mounted() {
    this.initialize();
  },
};
</script>
