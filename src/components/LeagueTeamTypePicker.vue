<template>
  <select v-model="teamType" @change="$emit('input', teamType)">
    <option v-for="(v, k) in LeagueTeamTypes" :key="k" :value="v">
      {{$t(`ui.team_types.${k}`)}}
    </option>
  </select>
</template>

<style scoped>

</style>

<script>
export const LeagueTeamTypes = {
  all: 1,
  team: 2,
  pair: 3,
};

export default {
  name: 'LeagueTeamTypePicker',
  props: ['value'],
  data() {
    return {
      teamType: this.value,
      LeagueTeamTypes,
    };
  },
};
</script>
