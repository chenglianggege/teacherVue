/**
 * Created by cj on 2017/11/23.
 */
import axios from 'axios'
import router from '@/router'

// http response 拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.retCode === 4001) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/')
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
