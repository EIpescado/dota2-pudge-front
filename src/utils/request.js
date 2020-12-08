import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Config from '@/settings'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: Config.requestTimeOut // request timeout,
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers[Config.requestTokenHeaderName] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      const resData = response.data
      if (resData.code === '0') {
        return resData.res
      } else {
        Message({
          message: resData.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        // 登录过期
        if (resData.code === '10004') {
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
        }
        return Promise.reject('error')
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Message({
          message: '网络请求超时',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      }
    }
    if (code) {
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Message({
          message: errorMsg,
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      Message({
        message: '接口请求失败',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
