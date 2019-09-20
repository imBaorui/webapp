import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '../utils/storage'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 初始化的时候从本地存储获取数据，没有就是 null
    user: getItem('user')
  },
  // 添加一个mutation用于修改state
  // 登陆成功，调用mutation将token放到Vuex容器中
  mutations: {
    setUser (state, user) {
      state.user = user
      // 为了防止页面刷新数据丢失，还需要将数据存储到本地存储
      setItem('user', state.user)
    }
  },
  actions: {

  }
})
