<template>
  <div id="app" class="container">
    <header>
      <nav class="navbar" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link class="navbar-item" to="/" active-class="" exact>Splatoon Stats</router-link>

          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
            data-target="globalNav" @click="toggleBurgerMenu" :class="isBurgerMenuOpen ? 'is-active' : ''">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="globalNav" class="navbar-menu" :class="isBurgerMenuOpen ? 'is-active' : ''">
          <div class="navbar-start">
            <router-link class="navbar-item" to="/weapons">Popular Weapons</router-link>
            <router-link class="navbar-item" to="/trends">Trends</router-link>
            <div class="navbar-item has-dropdown is-hoverable">
              <!-- See: https://github.com/vuejs/vue-router/issues/916#issuecomment-297424249 -->
              <router-link to="/rankings" tag="span" class="navbar-link" :event="''">Rankings</router-link>
              <div class="navbar-dropdown">
                <router-link class="navbar-item" to="/rankings/x">X Rankings</router-link>
                <router-link class="navbar-item" to="/rankings/league">League Rankings</router-link>
                <router-link class="navbar-item" to="/rankings/splatfest">Splatfest Rankings</router-link>
              </div>
            </div>
            <router-link class="navbar-item" to="/players">Players</router-link>
            <router-link class="navbar-item" to="/records">Records</router-link>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <input @keydown.enter="smartSearch" v-model="query" type="text" placeholder="Search player by name or ID" maxlength="16">
              <button @click="smartSearch">Search</button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <router-view></router-view>

    <footer class="is-flex align-center justify-center">
      <global-footer></global-footer>
    </footer>
  </div>
</template>

<script>
import './assets/bulma.scss';
import GlobalFooter from './components/GlobalFooter.vue';
import { isValidPlayerId } from './helper';

export default {
  name: 'app',
  components: { GlobalFooter },
  data() {
    return {
      isBurgerMenuOpen: false,
      query: '',
    };
  },
  methods: {
    smartSearch(e) {
      const { query } = this;

      if (isValidPlayerId(query)) {
        this.$router.push(`/players/${query}`);
      } else {
        this.$router.push(`/players/search?name=${query}`);
      }

      e.target.blur();
      this.query = '';
    },
    toggleBurgerMenu() {
      this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
    },
  },
};
</script>

<style lang="scss">
table a {
  font-weight: 300;
}
input:not([type="checkbox"]), select, option, button {
  height: 2.5em;
  color: #ecf0f1;
}
input, select {
  padding: .375em;
  border: 1px solid #7f8c8d;
  background-color: #34495e;
}
input:disabled, select:disabled {
  color: #77939b;
}
input::placeholder {
  color: #95a5a6;
}
input:focus, select:focus {
  background-color: #587ca0;
}
button {
  font-weight: bold;
  border: 1px solid #7f8c8d;
  background-color: #27ae60;
}
button.red {
  background-color: #e74c3c;
}
button:disabled {
  background-color: #7f8c8d;
}
button:active {
  outline: 0;
}
.checkboxes .checkbox:not(:last-child) {
  margin-right: 1em;
}
.checkboxes .checkbox input[type="checkbox"] {
  margin-right: .25em;
}

#app {
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-left: .5em;
  padding-right: .5em;
  padding-bottom: 5em; /* footer height */
}
#app > header {
  margin-bottom: 1em;
}
#app > footer {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 5em;
}

.controls {
  flex-direction: column;
}
.controls > div {
  display: flex;
  align-items: center;
  margin: .5em 0;
}
.controls select, .controls button, .controls input {
  margin: 0 .25em;
}
.controls .label {
  display: inline-block;
  text-align: right;
  margin-right: 1em;
  min-width: 7em;
}
.controls button {
  min-width: 4em;
}
.controls select.l {
  width: 8em;
}
.controls input.four-digits-num {
  width: 5em;
}

.table-title {
  margin: .5em 0;
}
.title {
  margin: .75em 0;
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
table td,
table th {
  line-height: 32px; /* This has to match with .weapon-icon height */
}

td.bar-chart-container {
  line-height: initial;
}

.player-name {}
.player-id {
  font-style: italic;
}

.league-members, .stage-names {
  display: flex;
  flex-wrap: wrap;
  max-width: 24em;
}
.league-members .league-member,
.stage-names .stage-name {
  flex: 1 50%;
  min-width: 12em;
}
.weapon-popularity-link {
  margin-bottom: 1em;
}

.section:not(:first-child) {
  margin-top: 1.5em;
}

@media screen and (max-width: 1024px) {
  .navbar-end .navbar-item {
    display: flex;
  }
  .navbar-end .navbar-item :first-child {
    flex: 1;
  }
}

$spacing-amounts: (1, 2, 3, 4, 5, 6, 8, 10, 12, 16);
$spacing-multiplier: 0.125rem;
$sides: (top, bottom, left, right);

@each $amount in $spacing-amounts {
  @each $side in $sides {
    .m#{str-slice($side, 0, 1)}-#{$amount} {
      margin-#{$side}: #{$amount * $spacing-multiplier} !important;
    }

    .p#{str-slice($side, 0, 1)}-#{$amount} {
      padding-#{$side}: #{$amount * $spacing-multiplier} !important;
    }
  }

  .v-space-between-#{$amount} > :not(:first-child) {
    margin-top: $amount * $spacing-multiplier !important;
  }
  .h-space-between-#{$amount} > :not(:first-child) {
    margin-left: $amount * $spacing-multiplier !important;
  }
}
</style>
