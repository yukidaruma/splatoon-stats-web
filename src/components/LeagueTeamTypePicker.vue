<template>
  <select v-model="teamType" @change="$emit('input', teamType)">
    <option v-for="(v, k) in leagueTeamTypeOptions" :key="k" :value="v">
      {{ $t(`ui.team_types.${k}`) }}
    </option>
  </select>
</template>

<script>
export const LeagueTeamTypes = {
  all: 1,
  team: 2,
  pair: 3,
};

export const LeagueTeamTypesTable = {
  ...LeagueTeamTypes,
  T: 2,
  P: 3,
};

export const leagueTeamTypeMemers = {
  [LeagueTeamTypes.team]: 4,
  [LeagueTeamTypes.pair]: 2,
};

export const teamTypeSymbols = {
  [LeagueTeamTypes.team]: 'T',
  [LeagueTeamTypes.pair]: 'P',
};

export default {
  name: 'LeagueTeamTypePicker',
  props: { noAll: Boolean, value: Number },
  watch: {
    value() {
      this.teamType = this.value;
    },
  },
  computed: {
    leagueTeamTypeOptions() {
      if (this.noAll) {
        return Object.fromEntries(
          Object.entries(LeagueTeamTypes).filter(([_, v]) => v !== LeagueTeamTypes.all), // eslint-disable-line no-unused-vars
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
