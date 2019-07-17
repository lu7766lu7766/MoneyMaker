import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _ from 'lodash'
import moment from 'moment'
import { JacPlugin } from '../../JacTools/index'
import MyPlugin from 'src/plugin'

Vue.use(JacPlugin, {
  _, moment
})
Vue.use(MyPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
