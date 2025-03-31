import axios from 'axios'
import userLoginstore from '../stores/user'

const request = axios.create({
  baseURL: 'http://127.0.0.1:3007', // 后端地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded', // 请求头
  },
})
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    const loginstore = userLoginstore()
    const token = loginstore.token

    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {

    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default request
