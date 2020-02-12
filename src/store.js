import Vue from 'vue';
import Vuex from 'vuex';
import apiClient from './api-client';
import storejs from 'store';

Vue.use(Vuex);

const favoritePlayers = storejs.get('favorite-players', []);
const saveFavoritePlayers = () => storejs.set('favorite-players', favoritePlayers);

const store = new Vuex.Store({
  state: {
    favoritePlayers,
    weapons: [],
  },
  mutations: {
    SET_WEAPONS(state, weapons) {
      state.weapons = weapons;
    },
  },
  actions: {
    async getWeapons(context) {
      if (this.state.weapons.length > 0) return;

      const { data } = await apiClient.get('/data');
      context.commit('SET_WEAPONS', data.weapons);
    },
    addFavoritePlayer(context, player) {
      favoritePlayers.push(player);

      saveFavoritePlayers();
    },
    removeFavoritePlayer(context, playerToRemove) {
      const i = favoritePlayers.findIndex(playerId => playerId === playerToRemove.id);
      favoritePlayers.splice(i, 1);

      saveFavoritePlayers();
    },
  },
});

export default store;
