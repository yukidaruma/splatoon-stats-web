import Vue from 'vue';
import Vuex from 'vuex';
import apiClient from './api-client';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
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
  },
});

export default store;
