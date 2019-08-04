<template>
  <table class="table" >
    <thead>
    <tr>
      <td>買進</td>
      <td>賣出</td>
      <td>平倉</td>
      <td>賺賠</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="action in actions">
      <td>{{ action.type > 0 ? action.price : '' }}</td>
      <td>{{ action.type < 0 ? action.price : '' }}</td>
      <td>{{ action.cover }}</td>
      <td>{{ action.cover ? action.type > 0 ? (action.cover - action.price) : (action.price - action.cover) : '' }}</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <td>小計</td>
      <td colspan="3">{{ totalMoney }}</td>
    </tr>
    </tfoot>
  </table>
</template>

<script>
  import IndexMixins from 'mixins/index'

  export default {
    mixins: [IndexMixins],
    computed: {
      totalMoney() {
        let sum = 0
        _.forEach(this.actions, action => {
          if (action.type > 0) {
            sum -= action.price
            if (action.cover) {
              sum += action.cover
            }
          } else {
            sum += action.price
            if (action.cover) {
              sum -= action.cover
            }
          }
        })
        return sum
      }
    }
  }
</script>
