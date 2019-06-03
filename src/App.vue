<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <router-link tag="li" to="/" :exact="true"><a>Index</a></router-link>
          <router-link tag="li" to="/weapons"><a>Popular Weapons</a></router-link>
          <router-link tag="li" to="/rankings/x"><a>X Rankings</a></router-link>
          <router-link tag="li" to="/rankings/league"><a>League Rankings</a></router-link>
          <router-link tag="li" to="/rankings/splatfest"><a>Splatfest Rankings</a></router-link>
          <router-link tag="li" to="/search"><a>Search players</a></router-link>
          <router-link tag="li" to="/records"><a>Records</a></router-link>
        </ul>
      </nav>
    </header>

    <router-view></router-view>

    <footer>
      <global-footer></global-footer>
    </footer>
  </div>
</template>

<script>
import 'ress';
import GlobalFooter from './components/GlobalFooter.vue';

export default {
  name: 'app',
  components: { GlobalFooter },
};
</script>

<style>
/*
 * Noto Sans Japanese (japanese) https://fonts.googleapis.com/earlyaccess/notosansjapanese.css
 */
@font-face {
  font-display: swap;
  font-family: 'Noto Sans Japanese';
  font-style: normal;
  font-weight: 100;
  src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.woff2) format('woff2'),
       url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.woff) format('woff'),
       url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.otf) format('opentype');
}
@font-face {
   font-display: swap;
  font-family: 'Noto Sans Japanese';
  font-style: normal;
  font-weight: 200;
  src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Light.woff2) format('woff2'),
       url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Light.woff) format('woff'),
       url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Light.otf) format('opentype');
}
@font-face {
   font-display: swap;
   font-family: 'Noto Sans Japanese';
   font-style: normal;
   font-weight: 300;
   src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-DemiLight.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-DemiLight.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-DemiLight.otf) format('opentype');
}
@font-face {
   font-display: swap;
   font-family: 'Noto Sans Japanese';
   font-style: normal;
   font-weight: 400;
   src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.otf) format('opentype');
 }
@font-face {
   font-display: swap;
   font-family: 'Noto Sans Japanese';
   font-style: normal;
   font-weight: 500;
   src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Medium.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Medium.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Medium.otf) format('opentype');
 }
@font-face {
   font-display: swap;
   font-family: 'Noto Sans Japanese';
   font-style: normal;
   font-weight: 700;
   src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.otf) format('opentype');
 }
@font-face {
   font-display: swap;
   font-family: 'Noto Sans Japanese';
   font-style: normal;
   font-weight: 900;
   src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Black.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Black.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Black.otf) format('opentype');
}
</style>

<style>
body, input, option, button {
  font-family: 'Noto Sans Japanese', sans-serif;
}
body {
  background-color: #1c2732;
  color: #bdc3c7;
}
a:link, a:visited, a:hover, a:active {
  color: #2fe3be;
}
h1, h2, h3, h4, h5, h6 {
  color: #ecf0f1;
}
table {
  border-collapse: collapse;
  background-color: #34495e;
}
th, td {
  padding: .25em;
  border: 1px solid #46627f
}
tr:hover {
  background-color: #587ca0;
}
input, select, option, button {
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
  background-color: #16a085;
}
button:disabled {
  background-color: #7f8c8d;
}
button:active {
  outline: 0;
}

#app {
  position: relative;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-bottom: 5em; /* footer height */
  box-sizing: border-box;
}
#app > header {
  margin-bottom: 1em;
}
#app > header nav ul {
  display: flex;
  list-style-type: none;
  font-weight: bold;
  height: 3em;
}
#app > header nav ul li {
  display: table;
  flex: 1;
  height: 100%;
}
#app > header nav ul li + li {
  border-left: 1px solid #46627f;
}
#app > header nav ul li:hover, #app > header nav ul li.router-link-active:hover {
  background-color: #587ca0;
}
#app > header nav ul li.router-link-active {
  background-color: #46627f;
}
#app > header nav ul li a {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  padding: 0 .5em;
  height: 100%;
  width: 100%;
  text-decoration: none;
}
#app > footer {
  display: flex;
  align-items: center;
  justify-content: center;
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

table.ranking {
  width: 100%;
}
.table-title {
  margin: .5em 0;
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

.league-members {
  display: flex;
  flex-wrap: wrap;
}
.league-members .league-member {
  flex: 1 50%;
}
</style>
