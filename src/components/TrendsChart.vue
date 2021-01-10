<template>
  <div>
    <div class="is-flex">
      <div class="group decreased">
        <template v-for="{ volume, weapon_id, icon } in decreased">
          <div :key="weapon_id" class="is-flex align-center row">
            <img :src="icon" />
            <span style="margin: 0 .5em">-{{ Math.abs(volume) }}</span>
            <div class="bar" :style="{ width: barWidth(volume) }" />
          </div>
        </template>
      </div>
      <div class="group increased">
        <template v-for="{ volume, weapon_id, icon } in increased">
          <div :key="weapon_id" class="is-flex align-center row">
            <div class="bar" :style="{ width: barWidth(volume) }" />
            <span style="margin: 0 .5em">+{{ volume }}</span>
            <img :src="icon" />
          </div>
        </template>
      </div>
    </div>
    <h3 style="margin-top: .5em">Unchanged Weapons</h3>
    <div class="unchanged">
      <template v-for="{ weapon_id, icon } in unchanged">
        <img :key="weapon_id" :src="icon" style="margin: .25em" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: { type: Array, required: true } },
  computed: {
    increased() {
      return this.data.filter(({ volume }) => volume > 0).sort((a, b) => b.volume - a.volume);
    },
    decreased() {
      return this.data.filter(({ volume }) => volume < 0).sort((a, b) => a.volume - b.volume);
    },
    unchanged() {
      return this.data.filter(({ volume }) => volume === 0);
    },
    largestVolume() {
      return Math.max(...this.data.map(({ volume }) => Math.abs(volume)));
    },
  },
  methods: {
    barWidth(volume) {
      return `calc(${Math.abs(volume) / this.largestVolume} * (100% - 4em))`;
    },
  },
};
</script>

<style scoped>
.bar {
  height: 18px;
}
.group {
  margin: 0 6px;
  width: 50%;
}
.group.increased .row {
  display: flex;
}
.group.decreased .row {
  display: flex;
  justify-content: flex-end;
}
.row:not(:first-child) {
  /* margin-top: 2px; */
}
.increased .bar {
  background: fixed linear-gradient(90deg, #e9116a, #f13c87);
}
.decreased .bar {
  background: fixed linear-gradient(270deg, #19d719, #3be83b);
}

img {
  width: 32px;
  height: 32px;
}
</style>
