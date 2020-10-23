import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    state: {
        player: {
            id: '123',
            name: 'User',
            photo: '',
        },
    },
    mutations: {},
    getters: {},
});
