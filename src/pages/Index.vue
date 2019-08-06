<template>
  <div class="layout">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{
        name: $route.name === 'action' ? 'main' : 'action'
      }">金多寶</b-navbar-brand>
    </b-navbar>

    <div class="layout-content">
      <div>
        目前時間： {{ time }} &nbsp;&nbsp;
        資料時間：{{ lastTime }}
      </div>
      <candle :date="date" @change="onDateChange" />
      <div class="container-fluid">
        <div class="row">
          <sub-total class="col-md-6"></sub-total>
          <action class="col-md-6" v-if="$route.name === 'action' && date === firstDate" :date="date" />
        </div>
      </div>
    </div>
    <div class="layout-copy" style="text-align: center">
      2019 &copy; JacWang
    </div>
  </div>
</template>

<script>
  import IndexMixins from 'mixins/index'
  import BuySound from 'src/assets/buy.mp3'
  import SellSound from 'src/assets/sell.mp3'
  import Hosts from 'config/Hosts'
  import env from 'src/../env'

  export default {
    mixins: [IndexMixins],
    components: {
      Candle: require('./Candle').default,
      Action: require('./Action').default,
      SubTotal: require('./SubTotal').default
    },
    data: () =>
    {
      return {
        ws: null,
        host: Hosts[env.target],
        channel: 'DataCollect',
        date: '',
        firstDate: null,
        time: moment().getDateTime(),
        timer: null
      }
    },
    methods: {
      onDateChange(date)
      {
        this.date = date
        this.$root.subscriber.emit('init', date)
      },
      wsInit() {
        this.ws = adonis.Ws(this.host).connect()
        this.ws.on('close', () => {
          console.log('close')
          setTimeout(() => {
            this.wsInit()
          }, 50)
        })
        return new Promise(resolve => {
          this.ws.on('open', () =>
          {
            this.$root.subscriber = this.ws.subscribe(this.channel)
            this.subscribeInit()
            this.subscribeAdvice()
            this.subscribeAction()
            this.subscribeDate()
            // this.$bus.emit('ws.ready')
            resolve(1)
          })
        })
      },
      subscribeInit() {
        // when date changed or get datas and actions
        this.$root.subscriber.on('init', res =>
        {
          this.setActions(res.actions)
          this.setDatas(res.datas)
        })
      },
      subscribeAdvice() {
        // when service has new data
        console.log('subscribe advice')
        this.$root.subscriber.on('advice', data =>
        {
          console.log('advice')
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
      },
      subscribeAction() {
        // when action submit success
        this.$root.subscriber.on('action', data =>
        {
          (new Audio(data.source.type > 0
            ? BuySound
            : SellSound)).play()
          if (data.source.date === this.date)
          {
            this.setActions(data.result)
          }
        })
      },
      subscribeDate() {
        // init get dates, when advice update dates
        this.$root.subscriber.on('getDate', dates => {
          if (!this.firstDate) {
            this.onDateChange(dates[0])
          }
          this.firstDate = _.first(dates)
          this.setDates(dates)
        })
        this.$root.subscriber.emit('getDate')
      },
      counter()
      {
        this.timer = setInterval(() =>
        {
          this.time = moment().getDateTime()
        }, 1000)
      }
    },
    computed: {
      lastTime()
      {
        return _.last(this.datas)
          ? moment(_.last(this.datas).created_at).getDateTime()
          : ''
      }
    },
    async created()
    {
      await this.wsInit()
      this.counter()
    }
  }
</script>
