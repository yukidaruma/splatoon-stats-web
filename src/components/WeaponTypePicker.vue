<template>
  <select v-model="weaponType" @input="$emit('input', $event.target.value)">
    <option value="weapons">{{ $t('ui.weapon_types.weapons') }}</option>
    <option value="mains">{{ $t('ui.weapon_types.mains') }}</option>
    <option value="subs">{{ $t('ui.weapon_types.subs') }}</option>
    <option value="specials">{{ $t('ui.weapon_types.specials') }}</option>
  </select>
</template>

<script>
import { rankedRules } from '../helper';

export default {
  name: 'WeaponTypePicker',
  props: ['value'],
  data() {
    return { weaponType: null };
  },
  created() {
    if (this.value) {
      this.weaponType = this.value;
    }
  },
};
</script>
