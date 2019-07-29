<template>
  <div class="layout">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{
        name: $route.name === 'action' ? 'main' : 'action'
      }">金多寶</b-navbar-brand>
    </b-navbar>

    <div class="layout-content">
      <candle :date="date" @change="onDateChange" />
      <action v-if="$route.name === 'action' && date === firstDate" :date="date" />
    </div>
    <div class="layout-copy">
      2011-2019 &copy; JacWang
    </div>
  </div>
</template>

<script>
  import IndexMixins from 'mixins/index'

  export default {
    mixins: [IndexMixins],
    components: {
      Candle: require('./Candle').default,
      Action: require('./Action').default
    },
    data: () =>
    {
      return {
        ws: null,
        host: 'ws://localhost:3333',
        channel: 'DataCollect',
        date: '',
        firstDate: null
      }
    },
    methods: {
      onDateChange(date)
      {
        this.date = date
        this.firstDate = this.firstDate || date
        this.$root.subscriber.emit('init', date)
      }
    },
    created()
    {
      this.ws = adonis.Ws(this.host).connect()
      this.ws.on('open', () =>
      {
        this.$root.subscriber = this.ws.subscribe(this.channel)
        // when date changed or get datas and actions
        this.$root.subscriber.on('init', res =>
        {
          this.setActions(res.actions)
          this.setDatas(res.datas)
        })
        // when service has new data
        this.$root.subscriber.on('advice', data =>
        {
          if (data.date === this.date)
          {
            this.setDatas(_.concat(this.datas, data))
          }
          // always checking todoActions
          this.setTodoActions(_.filter(this.todoActions, action => {
            if (action.price < data.high && action.price > data.low) {
              this.$root.subscriber.emit('action', Object.assign(action, {
                date: data.date,
                created_at: data.created_at
              }))
              return false
            }
            return true
          }))
        })
        // when action subit success
        this.$root.subscriber.on('action', data =>
        {
          if (data.date === this.date)
          {
            this.setActions(_.concat(this.actions, data))
          }
        })
        this.$bus.emit('ws.ready')
      })
    }
  }
</script>
