// stores/user.js
import { defineStore } from 'pinia'
import { getAllRouter } from '../api/routerMange'

const useUserLoginStore = defineStore('userLogin', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {},
    routerList: localStorage.getItem('routerList')
      ? JSON.parse(localStorage.getItem('routerList'))
      : [],
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    removeToken() {
      this.token = ''
      localStorage.removeItem('token')
      this.routerList = []
      localStorage.removeItem('routerList')
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    removeUser() {
      this.user = {}
      localStorage.removeItem('user')
    },
    // 设置路由列表
    async setRouterList() {
      if (this.token) {
        try {
          let res = await getAllRouter()
          this.routerList = res.data.data
          localStorage.setItem('routerList', JSON.stringify(this.routerList))
        } catch (error) {
          console.error('获取路由列表失败:', error)
          // 提供一个 fallback 的路由列表
          this.routerList = []
        }
      }
    },
  },
})

export default useUserLoginStore
