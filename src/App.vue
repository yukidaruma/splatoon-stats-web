<template>
  <div id="app">
    <router-link to="/">Index</router-link> |
    <router-link to="/leagues">Leagues</router-link>
    <router-link to="/weapons">Weapon popularity</router-link> |
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
  bottom: 0;
  height: 3em;
}
</style>
