import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import axios from 'axios';
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use({
  install(Vue) {
    Vue.prototype.$api = axios.create({
      baseURL: 'https://rentit-heroku.herokuapp.com/api/'
    })
  }
})
Vue.use(Buefy)

// Vue.use(BootstrapVue)
// Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')