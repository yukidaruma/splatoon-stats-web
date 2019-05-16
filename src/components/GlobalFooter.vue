<template>
  <div>
    <span>
      GitHub (
      <a href="https://github.com/yukidaruma/splatoon-stats">API</a>,
      <a href="https://github.com/yukidaruma/splatoon-stats-web">Web</a>
      )
    </span>
    <span>
      Twitter <a href="https://twitter.com/Yukinkling">@Yukinkling</a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
};
</script>

<style scoped>
div {
  text-align: center;
}
div span {
  font-size: 90%;
  padding: 0 1.5em;
}
div span + span {
  box-sizing: border-box;
  border-left: 1px solid #bdc3c7;
}
</style>
