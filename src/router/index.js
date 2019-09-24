import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Tabbar from '../views/tabbar'
import Home from '../views/home'
import Search from '../views/search'
import searchResult from '../views/search-result'
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/search/:q',
      name: 'search-result',
      component: searchResult
    },
    {
      path: '/tabbar',
      component: Tabbar,
      children: [
        {
          name: 'home',
          path: '', // 默认子路由
          component: Home
        }
      ]

    }
  ]
})

export default router
