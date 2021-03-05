// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import axios from 'axios'


Vue.use(ElementUI);
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
});
// 响应拦截器
axios.interceptors.response.use(function (response) {
  response = response.data
  if (response.meta.status == 401) {
    localStorage.removeItem('token')
    response.meta.msg='尊敬的用户,你的登录状态已过期，请重新登陆'
    router.push('/login')
  }
  return response


}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
