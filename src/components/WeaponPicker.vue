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

        <weapon-icon-count
          v-for="weapon in weapons"
          @click.native="toggleSelection(weapon.weapon_id)"
          :is-active="selectedWeapons.includes(weapon.weapon_id)"
          :key="weapon.weapon_id"
          :weapon-id="weapon.weapon_id"
          :count="getCountFor(weapon.weapon_id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-controls {
  display: flex;
  justify-content: space-between;
}
</style>

<script>
import { mapState } from 'vuex';
import WeaponIconCount from './WeaponIconCount.vue';
import { weaponReskins } from '../constants';

export default {
  components: { WeaponIconCount },
  computed: {
    ...mapState({
      allWeapons(state) {
        return state.weapons;
      },
    }),
    isAllSelected() {
      return this.selectedWeapons.length === this.weapons.length;
    },
    normalizedOptions() {
      if (!this.options) {
        return null;
      }

      const normalizeWeaponVariant = (weaponId) => (weaponId in weaponReskins ? weaponReskins[weaponId] : weaponId);

      return this.options.map(normalizeWeaponVariant);
    },
    weapons() {
      if (this.normalizedOptions) {
        return this.allWeapons.filter((w) => this.normalizedOptions.includes(w.weapon_id));
      }

      return this.allWeapons;
    },
  },
  props: {
    options: Array,
    value: {
      type: Array,
      default: () => [],
    },
    counts: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isOpen: false,
      selectedWeapons: [],
    };
  },
  methods: {
    getCountFor(weaponId) {
      const variantsCount = Object.entries(weaponReskins)
        .filter(([_, originalWeaponId]) => originalWeaponId === weaponId)
        .reduce((sum, [id, _]) => sum + (this.counts[id] ?? 0), 0);

      return (this.counts[weaponId] ?? 0) + variantsCount;
    },
    closeModal() {
      this.isOpen = false;
    },
    openModal() {
      this.isOpen = true;
    },
    selectAll() {
      this.selectedWeapons = this.weapons.map((w) => w.weapon_id);
    },
    toggleSelection(weaponId) {
      if (this.selectedWeapons.includes(weaponId)) {
        this.selectedWeapons = this.selectedWeapons.filter((w) => w !== weaponId);
        return;
      }
      this.selectedWeapons.push(weaponId);
    },
    initialize() {
      if (Array.isArray(this.value)) {
        this.selectedWeapons = this.value;
        return;
      }

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
        this.$emit('update:value', null);
        return;
      }
      this.$emit('update:value', this.selectedWeapons);
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
