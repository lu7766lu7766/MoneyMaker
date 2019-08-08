<template>
  <table class="table" >
    <thead>
    <tr>
      <td>#</td>
      <td>成交時間</td>
      <td>買進</td>
      <td>賣出</td>
      <td>平倉時間</td>
      <td>平倉</td>
      <td>賺賠</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(action, index) in actions">
      <td>{{ actions.length - index }}</td>
      <td>{{ moment(action.created_at).getDateTime() }}</td>
      <td>{{ action.type > 0 ? action.price : '' }}</td>
      <td>{{ action.type < 0 ? action.price : '' }}</td>
      <td>{{ action.updated_at }}</td>
      <td>{{ action.cover }}</td>
      <td>
        <span v-if="action.cover">
          {{ action.type > 0 ?  (action.cover - action.price) : (action.price - action.cover) }}
        </span>
      </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <td>小計</td>
      <td colspan="5">{{ totalMoney }}</td>
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
        return _.reduce(this.actions, (sum, action) =>
        {
          if (action.cover)
          {
            return sum + (action.type * (action.price - action.cover))
          } else {
            return sum
          }
        }, 0)
      }
    }
  }
</script>
