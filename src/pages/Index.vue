<template>
  <div class="layout">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">金多寶</b-navbar-brand>
    </b-navbar>

    <div class="layout-content">
      <router-view />
    </div>
    <div class="layout-copy">
      2011-2019 &copy; JacWang
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      ws: null,
      subscriber: null,
      channel: 'DataCollect',
      datas: []
    }),
    mounted()
    {
      this.ws = adonis.Ws('ws://localhost:3333').connect()
      this.ws.on('open', () =>
      {
        this.subscriber = this.ws.subscribe(this.channel)
        this.subscriber.on('init', datas =>
        {
          console.log(datas)
        })
        this.subscriber.on('advice', data =>
        {
          console.log(data)
        })
        this.subscriber.emit('init', '2019-07-22')
      })
    }
  }
</script>
