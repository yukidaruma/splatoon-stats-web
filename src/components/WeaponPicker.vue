<template>
  <div>
    <template v-if="weapons.length === 0">
      <button @click="openModal" disabled>{{ openButtonLabel || 'Open' }}</button>
    </template>
    <template v-else>
      <div class="is-flex" style="align-items: center;">
        <button @click="openModal">{{ openButtonLabel || 'Open' }}</button>
        <span v-if="single">
          <weapon-icon-count v-if="selectedWeapons.length" :weapon-id="selectedWeapons[0]" />
        </span>
        <span v-else>
          ({{selectedWeapons.length}}/{{weapons.length}})
        </span>
      </div>
    </template>

    <div :class="['modal', isOpen ? 'is-active' : '']">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="modal-controls">
          <template v-if="!single">
            <button v-if="!isAllSelected" @click="selectAll">Select All</button>
            <button v-else @click="unselectAll">Unselect All</button>
          </template>
          <button class="red" @click="closeModal">Close</button>
        </div>

        <weapon-icon-count
          v-for="weapon in weapons"
          @click.native="toggleSelection(weapon.weapon_id)"
          :is-active="single || selectedWeapons.includes(weapon.weapon_id)"
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
.modal-controls .red {
  margin-left: auto;
}
</style>

<script>
import { mapState } from 'vuex';
import WeaponIconCount from './WeaponIconCount.vue';
import { weaponIdsWithReskins } from '../helper';

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

      return this.options.flatMap(weaponIdsWithReskins);
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
      type: [Array, Number],
      default: () => [],
    },
    counts: {
      type: Object,
      default: () => ({}),
    },
    single: Boolean,
    openButtonLabel: String,
  },
  data() {
    return {
      isOpen: false,
      selectedWeapons: [],
    };
  },
  methods: {
    getCountFor(weaponId) {
      return weaponIdsWithReskins(weaponId)
        .map((id) => this.counts[id] ?? 0)
        .reduce((sum, value) => sum + value, 0);
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
      if (this.single) {
        this.selectedWeapons = [weaponId];
        this.closeModal();
        return;
      }

      if (this.selectedWeapons.includes(weaponId)) {
        this.selectedWeapons = this.selectedWeapons.filter((w) => w !== weaponId);
        return;
      }
      this.selectedWeapons.push(weaponId);
    },
    initialize() {
      if (this.single) {
        this.selectedWeapons = Array.isArray(this.value) ? this.value : [this.value];
        return;
      }

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
      if (this.single) {
        this.$emit('update:value', this.selectedWeapons[0]);
        return;
      }

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
