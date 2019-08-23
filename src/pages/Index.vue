<template>
  <div class="layout">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{
        name: $route.name === 'action' ? 'main' : 'action'
      }">金多寶</b-navbar-brand>
    </b-navbar>

    <div class="layout-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8">
            <div>
              目前時間： {{ time }} &nbsp;&nbsp;
              資料時間：{{ lastTime }}
            </div>
            <candle :date="date" @change="onDateChange" />
            <action class="col-md-12" v-if="$route.name === 'action'" :firstDate="firstDate" :lastData="lastData" />
          </div>
          <div class="col-md-4">
            <sub-total class="col-md-12"></sub-total>
          </div>
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
  import CoverSound from 'src/assets/cover.mp3'
  import Hosts from 'config/Hosts'
  import env from 'src/../env'
  import { Howl } from 'howler'

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
        lastData: null,
        time: moment().getDateTime(),
        timer: null,
        buySound: new Howl({
          src: [BuySound]
        }),
        sellSound: new Howl({
          src: [SellSound]
        }),
        coverSound: new Howl({
          src: [CoverSound]
        })
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
        this.ws.on('close', e =>
        {
          console.error('close: ', e)
          location.reload()
        })
        this.ws.on('error', e =>
        {
          console.error('error: ', e)
          location.reload()
        })
        return new Promise(resolve => {
          this.ws.on('open', () =>
          {
            this.$root.subscriber = this.ws.subscribe(this.channel)
            // this.subscribeInit()
            this.onAdvice()
            this.onAction()
            this.onGetActions()
            this.onGetDatas()
            this.onGetDateList()
            // init dates first at start
            this.$root.subscriber.emit('getDateList')
            resolve(1)
          })
        })
      },
      onAdvice()
      {
        // when service has new data
        this.$root.subscriber.on('advice', data =>
        {
          console.log('advice')
          this.lastData = data
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
      onAction()
      {
        // when action write success
        this.$root.subscriber.on('action', data =>
        {
          const sound = (!data.isCover
            ? data.type > 0
              ? this.buySound
              : this.sellSound
            : this.coverSound)
          sound.play()
        })
      },
      // setting
      onGetActions()
      {
        // get new action list
        this.$root.subscriber.on('getActions', res =>
        {
          if (res.date === this.date)
          {
            this.setActions(res.data)
          }
        })
      },
      onGetDatas()
      {
        this.$root.subscriber.on('getDatas', datas =>
        {
          if (!this.lastData)
          {
            this.lastData = _.last(datas)
          }
          if (this.lastData.date === this.date)
          {
            this.setDatas(datas)
          }
        })
      },
      onGetDateList()
      {
        // init get dates, when advice update dates
        this.$root.subscriber.on('getDateList', dates =>
        {
          const firstDate = _.first(dates)

          if (!this.firstDate) {
            this.onDateChange(firstDate)
          }
          this.firstDate = firstDate
          this.setDates(dates)
        })
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
