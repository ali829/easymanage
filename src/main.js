/*
 =========================================================
 * Vue Black Dashboard - v1.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/black-dashboard
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import VueRouter from "vue-router";
import RouterPrefetch from 'vue-router-prefetch'
import App from "./App";

// TIP: change to import router from "./router/starterRouter"; to start with a clean layout
import router from "./router/index";
import axios from 'axios'
import store from './store'
import BlackDashboard from "./plugins/blackDashboard";
import i18n from "./i18n"
import './registerServiceWorker'
import swal from 'sweetalert2';
window.Swal = swal;
require('@/store/subscriber.js')
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

Vue.use(BlackDashboard);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);

store.dispatch('auth/attempt',localStorage.getItem('token'))
.then(()=>{
  /* eslint-disable no-new */
  new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
  }).$mount("#app");
})


