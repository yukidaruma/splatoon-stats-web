<template>
  <select v-model="teamType" @change="$emit('input', teamType)">
    <option v-for="(v, k) in leagueTeamTypeOptions" :key="k" :value="v">
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

export const teamTypeSymbols = {
  [LeagueTeamTypes.team]: 'T',
  [LeagueTeamTypes.pair]: 'P',
};

export default {
  name: 'LeagueTeamTypePicker',
  props: ['noAll', 'value'],
  computed: {
    leagueTeamTypeOptions() {
      if (this.noAll) {
        return Object.fromEntries(
          Object.entries(LeagueTeamTypes)
            .filter(([_, v]) => v !== LeagueTeamTypes.all), // eslint-disable-line no-unused-vars
        );
      }
      return LeagueTeamTypes;
    },
  },
  data() {
    return {
      teamType: this.value,
      LeagueTeamTypes,
    };
  },
};
</script>
