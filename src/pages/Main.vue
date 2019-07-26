<template>
  <div>
    <b-form-select :value="date" :options="dates" @change="onDateChange"></b-form-select>
    <ve-candle :data="chartData"></ve-candle>
    <action v-if="$route.name === 'action'" />
  </div>
</template>

<script>
  export default {
    props: ['date', 'datas'],
    components: {
      Action: require('./Action').default
    },
    data: () =>
    {
      const initSubDay = moment().isBefore(moment().format('YYYY-MM-DD 15:00:00'))
        ? 1
        : 0
      const dates = []
      _.range(0, 5).forEach(index =>
      {
        dates.push(moment().subtract(index + initSubDay, 'days').getDate())
      })
      return {
        dates
      }
    },
    methods: {
      onDateChange(date)
      {
        this.$emit('change', date)
      }
    },
    computed: {
      chartData()
      {
        return {
          columns: ['time', 'open', 'close', 'lowest', 'highest', 'vol'],
          rows: _.map(this.datas, data => ({
            'time': data.created_at,
            'open': data.open,
            'close': data.close,
            'lowest': data.low,
            'highest': data.high,
            'vol': data.volume
          }))
        }
      }
    },
    mounted()
    {
      this.$bus.on('ws.ready', () =>
      {
        this.$bus.emit('init', this.date)
      })
    },
    destroyed()
    {
      this.$bus.off('ws.ready')
    }
  }
</script>
