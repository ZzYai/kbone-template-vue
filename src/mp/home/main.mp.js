import Vue from 'vue'
import App from '../../App.vue'
import "../../utils/rem"
import router from "../../routes"
import "../../../public/global.css"
import store from "../../store"
import api from "../../api/api"
import 'vant/lib/index.less';
import MyScript from '../../lib/globalJS.js'


// import Vue from 'vue'
// import Router from 'vue-router'
// import App from '../../App.vue'
// import store from '../../store'
// import Home from '../../home/Index.vue'

// Vue.use(Router)

// const router = new Router({
//   mode: 'history',
//   routes: [{
//     path: '/(home|index)?',
//     name: 'Home',
//     component: Home,
//   }, {
//     path: '/index.html',
//     name: 'HomeHtml',
//     component: Home,
//   }, {
//     path: '/test/(home|index)',
//     name: 'HomeTest',
//     component: Home,
//   }],
// })

export default function createApp() {
  
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


  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  // Vue.config.productionTip = false

  return new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
