import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
// 按需注册 Vant 组件
import { Button, NavBar, Field, CellGroup, Cell, Toast, Tabbar, TabbarItem, Tab, Tabs } from 'vant'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules'

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}
// 添加自定义规则 手机号的格式 在验证的地方用 | phone 添加
extend('phone', {
  validate (value) {
    return /^[1]([3-9])[0-9]{9}$/.test(value)
  },
  message: '手机号格式错误'
})

Vue.use(Button)
  .use(NavBar)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)

Vue.config.productionTip = false
// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
