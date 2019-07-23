<template>
  <div>i'm main</div>
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
