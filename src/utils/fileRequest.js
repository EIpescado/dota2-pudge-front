import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Config from '@/settings'

const fileService = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: Config.fileRequestTimeOut
})

fileService.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers[Config.requestTokenHeaderName] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response 拦截器
fileService.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Message({ message: '系统异常,稍后重试', type: 'error', duration: 5 * 1000 })
      return Promise.reject('error')
    } else {
      const resData = response.data
      if (resData instanceof Blob) {
        return response
      } else {
        Message({ message: resData.message || '文件系统异常', type: 'error', duration: 5 * 1000 })
        return Promise.reject('error')
      }
    }
  },
  error => {
    console.log('文件下载异常', error)
    return Promise.reject(error)
  }
)

export default fileService
