const weaponFilterQueryParamMixin = {
  created() {
    const { weapons } = this.$route.query;
    if (weapons) {
      this.filters.weapons = typeof weapons === 'number'
        ? [weapons]
        : weapons.split(',').map(Number);
    }
  },
  watch: {
    'filters.weapons'(weapons) {
      const weaponsQuery = weapons
        ? [...weapons].sort().join(',')
        : undefined;

      this.$router.push({
        query: {
          ...this.$route.query,
          weapons: weaponsQuery,
        },
      });
    },
  },
};

module.exports = { weaponFilterQueryParamMixin };
