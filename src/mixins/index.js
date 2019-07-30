import BuySound from 'src/assets/buy.mp3'
import SellSound from 'src/assets/sell.mp3'

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
    emitAction(data)
    {
      (new Audio(data.type > 0
        ? BuySound
        : SellSound)).play()
      this.$root.subscriber.emit('action', data)
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
    }
  }
}