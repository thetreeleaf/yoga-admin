import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import './assets/icons' // icon
import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import Pagination from '@/components/Pagination'

import 'default-passive-events' // 移除浏览器提示 Added non-passive event listener to a scroll-blocking...



// 全局组件挂载
Vue.component('Pagination', Pagination)

// 全局指令注册
import permission from './directive/permission'
Vue.use(permission)

// 全局方法挂载
import global from "@/utils/global";
Vue.use(global)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})