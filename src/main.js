
import Vue from 'vue'
import App from './App.vue'
import "./utils/rem"
import router from "./routes"
import "../public/global.css"
import store from "./store"
import api from "./api/api"
import 'vant/lib/index.less';
import MyScript from './lib/globalJS.js'
Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$ms = MyScript
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// console.log(vConsole.version)
// new Vue({
//   render: h => h(App),
//   router,
//   store
// }).$mount('#app')


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
