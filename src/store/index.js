import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    actions: [],
    todoActions: [],
    datas: []
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
    }
  },
  actions: {},
  plugins: [createPersistedState()]
})
