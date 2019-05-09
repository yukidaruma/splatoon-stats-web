<template>
  <div id="app">
    <router-link to="/">Index</router-link> |
    <router-link to="/weapons">Weapon popularity</router-link> |
    <router-link to="/rankings/x">X Rankings</router-link> |
    League Rankings |
    <router-link to="/players">Players</router-link>
    <router-view></router-view>

    <global-footer></global-footer>
  </div>
</template>

<script>
import GlobalFooter from './components/GlobalFooter.vue';

export default {
  name: 'app',
  components: { GlobalFooter },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  position: relative;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1em;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-bottom: 3em; /* footer height */
  box-sizing: border-box;
}

.global-footer {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3em;
}

.weapon-name-container {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.weapon-icon {
  height: 32px;
  width: 32px;
}

.player-name {}
.player-id {
  font-style: italic;
}
</style>
