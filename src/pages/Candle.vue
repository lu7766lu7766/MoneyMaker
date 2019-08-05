<template>
  <div>
    <b-form-select :value="date" :options="dates" @change="onDateChange"></b-form-select>
    <ve-candle :data="chartData" :settings="chartSettings" :after-config="getChartConfig" :markPoint="markPoint"></ve-candle>
  </div>
</template>

<script>
  import IndexMixins from 'mixins/index'

  export default {
    mixins: [IndexMixins],
    props: ['date'],
    // data: () =>
    // {
    //   const initSubDay = moment().isBefore(moment().format('YYYY-MM-DD 15:00:00'))
    //     ? 1
    //     : 0
    //   const dateList = []
    //   _.range(0, 5).forEach(index =>
    //   {
    //     dateList.push(moment().subtract(index + initSubDay, 'days').getDate())
    //   })
    //   return {
    //     dateList
    //   }
    // },
    methods: {
      onDateChange(date)
      {
        this.$emit('change', date)
      },
      getChartConfig(options) {
        // console.log(options.series)
        options.series[0].name = '台指近月'
        // options.series[0].markPoint = {
        //   data: _.map(this.actions, action => ({
        //     coord: [action.created_at, action.price],
        //     value: action.price,
        //     itemStyle: {
        //       normal: {color: action.type > 0 ? 'rgb(255,0,0)' : 'rgb(41,60,85)'}
        //     }
        //   }))
        // }
        options.title = {
          text: '台指近月'
        }
        options.legend = {
          // data: ['小型台指近月'],
          show: false
        }
        return options
      }
    },
    computed: {
      chartData()
      {
        // 60 * (24 - 3.75 - 1.25) 一天正常資料量
        const fillLength = 60 * (24 - 3.75 - 1.25) - this.datas.length
        let fillDatas = _.cloneDeep(this.datas)
        if (fillLength > 0)
        {
          fillDatas = _.concat(this.datas, _.fill(Array(fillLength), {created_at: ''}))
        }
        // 小型台指近月
        return {
          columns: ['time', 'open', 'close', 'lowest', 'highest'],
          rows: _.map(fillDatas, data => ({
            'time': data.created_at,
            'open': data.open,
            'close': data.close,
            'lowest': data.low,
            'highest': data.high
          }))
        }
      },
      chartSettings() {
        return {
          showDataZoom: true,
          start: 0,
          end: 100
        }
      },
      markPoint() {
        return {
          data: _.map(this.actions, action => ({
            coord: [moment(action.created_at).getDateTime(), action.price],
            value: action.price,
            itemStyle: {
              normal: {color: action.type > 0 ? 'rgb(255,0,0)' : 'rgb(41,60,85)'}
            }
          }))
        }
      }
    },
    mounted()
    {
      this.$bus.on('ws.ready', () =>
      {
        console.log('ws.ready')
        this.$emit('change', this.dates[0])
      })
    },
    destroyed()
    {
      this.$bus.off('ws.ready')
    }
  }
</script>
