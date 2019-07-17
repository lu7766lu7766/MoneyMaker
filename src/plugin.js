import API from 'lib/API'
import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate'
import zh_TW from 'vee-validate/dist/locale/zh_TW'
import VueBus from 'vue-bus'
import VCharts from 'v-charts'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


export default {
  install: function (Vue, options)
  {
    Vue.prototype._ = _
    Vue.prototype.moment = moment
    Vue.prototype.$api = new API()
    Vue.use(BootstrapVue)

    Vue.filter('dateTime', function (value)
    {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    })
    Vue.filter('date', function (value)
    {
      return moment(value).format('YYYY-MM-DD')
    })

    const config = {
      locale: 'zh_TW',
      events: 'input|blur',
      dictionary: {zh_TW},
      errorBagName: 'errorBags', // change if property conflicts.
      fieldsBagName: 'fieldBags'
    }
    zh_TW.messages.required = () => '這個欄位是必填'
    zh_TW.messages.length = () => '長度錯誤'

    Vue.use(VeeValidate, config)
    Vue.use(VueBus)
    Vue.use(VCharts)
    Vue.use(Loading)
  }
}

import env from 'src/../env'

global.getenv = (key, defaultVal) =>
{
  return env[key] || defaultVal
}