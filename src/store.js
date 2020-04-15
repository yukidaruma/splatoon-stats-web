import Vue from 'vue';
import Vuex from 'vuex';
import storejs from 'store';

import apiClient from './api-client';

Vue.use(Vuex);

const favoritePlayers = storejs.get('favorite-players', []);
const saveFavoritePlayers = () => storejs.set('favorite-players', favoritePlayers);

const store = new Vuex.Store({
  state: {
    favoritePlayers,
    focusedPlayerId: '',
    weapons: [],
  },
  mutations: {
    SET_FOCUSED_PLAYER_ID(state, id) {
      state.focusedPlayerId = id;
    },
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
    setFocusedPlayerId(context, playerId) {
      context.commit('SET_FOCUSED_PLAYER_ID', playerId);
    },
    unsetFocusedPlayerId(context) {
      context.commit('SET_FOCUSED_PLAYER_ID', '');
    },
    removeFavoritePlayer(context, playerToRemove) {
      const i = favoritePlayers.findIndex(playerId => playerId === playerToRemove.id);
      favoritePlayers.splice(i, 1);

      saveFavoritePlayers();
    },
  },
});

export default store;
