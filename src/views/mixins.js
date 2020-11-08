const weaponFilterQueryParamMixin = {
  created() {
    const { weapons } = this.$route.query;
    if (weapons) {
      this.filters.weapons = typeof weapons === 'number'
        ? [weapons]
        : weapons.split(',').map(Number);
    }
  },
  computed: {
    serializedWeaponsFilter() {
      const { weapons } = this.filters;
      return [...weapons].sort((a, b) => a - b).join(',');
    },
  },
  watch: {
    'filters.weapons'(weapons) {
      this.$router.push({
        query: {
          ...this.$route.query,
          weapons: weapons ? this.serializedWeaponsFilter : undefined,
        },
      });
    },
  },
  methods: {
    normalizeRoutePath(path) {
      let routePath = path;
      if (this.filters.weapons) {
        routePath += `?weapons=${this.serializedWeaponsFilter}`;
      }
      return routePath;
    },
  },
};

module.exports = { weaponFilterQueryParamMixin };
