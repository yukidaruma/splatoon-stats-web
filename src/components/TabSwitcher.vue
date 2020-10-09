<template>
  <div class="tabs">
    <ul>
      <li
        v-for="tab in tabs"
        :key="tab.key"
        :class="activeTab === tab.key && 'is-active'"
        @click="onClick(tab.key)"
      >
        <a>{{tab.label}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['tabs'],
  data() {
    return { activeTab: this.value || this.tabs[0].key };
  },
  methods: {
    onClick(newTabKey) {
      this.activeTab = newTabKey;
      this.$emit('input', newTabKey);
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .tabs ul {
    flex-direction: column;
  }

  .tabs ul li {
    width: 100%;
  }
}
</style>
