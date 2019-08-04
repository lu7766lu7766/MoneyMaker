import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    actions: [],
    todoActions: [],
    datas: [],
    dates: []
  },
  mutations: {
    SET_ACTIONS(state, datas) {
      state.actions = datas
    },
    SET_TODO_ACTIONS(state, datas) {
      state.todoActions = datas
    },
    SET_DATAS(state, datas) {
      state.datas = datas
    },
    SET_DATES(state, datas) {
      state.dates = datas
    }
  },
  actions: {},
  plugins: [createPersistedState()]
})
