import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('pages/Index')
    },
    {
      path: '/action',
      name: 'action',
      component: () => import('pages/Index')
    },
    {path: '*', redirect: '/'}
  ]
})
