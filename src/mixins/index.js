export default {
  methods: {
    setActions(actions) {
      this.$store.commit('SET_ACTIONS', actions)
    },
    setTodoActions(actions) {
      this.$store.commit('SET_TODO_ACTIONS', actions)
    },
    setDatas(datas) {
      this.$store.commit('SET_DATAS', datas)
    },
    setDates(dates) {
      this.$store.commit('SET_DATES', dates)
    }
  },
  computed: {
    datas() {
      return this.$store.state.datas
    },
    actions() {
      return this.$store.state.actions
    },
    todoActions() {
      return this.$store.state.todoActions
    },
    dates() {
      return this.$store.state.dates
    },
  }
}