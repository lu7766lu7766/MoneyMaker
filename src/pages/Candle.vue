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
      fillLength()
      {
        // 60 * (24 - 3.75 - 1.25) 一天正常資料量
        // const fillLength = 60 * (24 - 3.75 - 1.25) - this.datas.length
        const day = moment(this.date).format('e')
        let dataHours
        switch (+day)
        {
          case 0:
            // 1 08:45 ~ 13:45
            dataHours = 60 * 5
            break
          case 1:
          case 2:
          case 3:
          case 4:
            // 15:00 ~ 05:00
            // 08:45 ~ 13:45
            dataHours = 60 * (24 - 3.75 - 1.25)
            break
          case 5:
            // 5 15:00 ~ 05:00(6)
            dataHours = 60 * 14
            break
          default:
            break
        }
        return dataHours - this.datas.length
      },
      chartData()
      {
        let fillDatas = _.cloneDeep(this.datas)
        if (this.fillLength > 0)
        {
          fillDatas = _.concat(this.datas, _.fill(Array(this.fillLength), {created_at: ''}))
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
        // price
        let data = _.map(this.actions, action => ({
          coord: [moment(action.created_at).getDateTime(), action.price],
          value: action.price,
          itemStyle: {
            normal: {
              color: action.type > 0
                ? 'rgb(255,0,0)'
                : 'rgb(41,60,85)'
            }
          }
        }))
        // cover
        data = _.concat(data, _.filter(_.map(this.actions, action =>
        {
          if (action.cover)
          {
            return {
              coord: [moment(action.updated_at).getDateTime(), action.cover],
              value: action.cover,
              itemStyle: {
                normal: {
                  color: 'rgb(128,42,42)'
                }
              }
            }
          }
          else
          {
            return ''
          }
        })), data => data !== '')
        return {
          data
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
