<template>
  <div class="layout">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">金多寶</b-navbar-brand>
    </b-navbar>

    <div class="layout-content">
      <router-view :date="date" :datas="datas" @change="onDateChange" />
    </div>
    <div class="layout-copy">
      2011-2019 &copy; JacWang
    </div>
  </div>
</template>

<script>
  export default {
    data: () =>
    {
      const initSubDay = moment().isBefore(moment().format('YYYY-MM-DD 15:00:00'))
        ? 1
        : 0
      return {
        ws: null,
        subscriber: null,
        host: 'ws://localhost:3333',
        channel: 'DataCollect',
        date: moment().subtract(initSubDay, 'days').getDate(),
        datas: []
      }
    },
    methods: {
      onDateChange(date)
      {
        this.date = date
        this.$bus.emit('init', date)
      }
    },
    created()
    {
      this.ws = adonis.Ws(this.host).connect()
      this.ws.on('open', () =>
      {
        this.subscriber = this.ws.subscribe(this.channel)
        this.subscriber.on('init', datas =>
        {
          this.datas = datas
        })
        this.subscriber.on('advice', data =>
        {
          //console.log(data)
          if (data.date === this.date)
          {
            this.datas.push(data)
          }
        })
        this.$bus.on('init', date =>
        {
          this.subscriber.emit('init', date)
        })
        this.$bus.emit('ws.ready')
      })
    },
    destroyed()
    {
      this.$bus.off('init')
    }
  }
</script>
