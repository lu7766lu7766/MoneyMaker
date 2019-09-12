<template>
  <div class="row">
    <div class="col-md-6">
      <h4>控制區</h4>
      <div class="form-group">
        <div class="input-group">
          <b-button-group>
            <b-form-input v-model.number="price" placeholder="Enter your name"></b-form-input>
            <b-button variant="danger" @click="addTodoAction(1)">買</b-button>
            <b-button variant="primary" @click="addTodoAction(-1)">賣</b-button>
          </b-button-group>
        </div>
      </div>
      <br/>
      <br/>
      <div class="form-group">
        <div class="input-group doing">
          <b-button variant="danger" @click="addAction(1)">現買</b-button>
          <b-button variant="primary" @click="addAction(-1)">現賣</b-button>
          <!--<b-button variant="info" v-if="isLocalhost" @click="testAdvice">測試advice</b-button>-->
        </div>
      </div>
    </div>

    <div class="col-md-5">
      <h4>預掛</h4>
      <div class="todo-list">
        <div class="todo"
             v-for="(action, index) in todoActions"
             :key="index"
             :class="action.type > 0 ? 'buy': 'sell'">
          <button type="button" class="close" @click="deleteTodoAction(index)">
            <span aria-hidden="true">&times;</span>
          </button>
          {{ action.price }}
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import IndexMixins from 'mixins/index'
  export default {
    props: ['firstDate', 'lastData'],
    mixins: [IndexMixins],
    data: () => ({
      price: 10000
    }),
    methods: {
      addTodoAction(type)
      {
        this.setTodoActions(_.concat(this.todoActions, {
          price: this.price,
          type
        }))
      },
      deleteTodoAction(index) {
        this.setTodoActions(_.filter(this.todoActions, (v, i) => i !== index))
      },
      addAction(type)
      {
        this.$root.subscriber.emit('action', {
          date: this.firstDate,
          price: this.lastData.close,
          type,
          created_at: this.lastData.created_at
        })
      },
      testAdvice()
      {
        this.$root.subscriber.emit('bordcast', JSON.stringify(this.lastData))
      }
    },
    computed: {
      isLocalhost() {
        return location.host.indexOf('localhost') > -1
      }
    }
  }
</script>

<style lang="stylus">
  .todo-list
    padding 10x 0
    .todo
      margin 10px 0
      padding 10px
      border-radius 5px
      color #fff

  .buy
    background #dc3545

  .sell
    background #007bff

  .doing button
    margin-right 10px


</style>