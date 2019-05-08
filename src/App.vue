<template>
  <div id="app">
    <router-link to="/">Index</router-link> |
    <router-link to="/leagues">Leagues</router-link>
    <router-link to="/weapons">Weapon popularity</router-link> |
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
