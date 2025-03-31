import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/index.vue'
import Login from '../Page/Login/index.vue'
import useUserLoginStore from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login', // 重定向到登录页面
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      children: [], // 初始化为空，稍后动态添加
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/:pathMatch(.*)*', // 捕获所有未匹配的路由
      redirect: '/home', // 重定向到首页或其他 fallback 页面
    },
  ],
})

/**
 * 生成动态路由
 */
function generateRoutes(data) {
  if (!Array.isArray(data)) {
    console.error('动态路由需要传入数组，但实际传入的是:', data)
    return []
  }

  return data.map((item) => {
    // 检查 item.component 是否有效
    if (typeof item.component !== 'string') {
      console.error('无效的组件路径:', item.component)
      return null // 跳过无效的路由
    }

    // 构造路由对象
    const route = {
      path: item.path,
      name: item.nickname || item.category_nickname,
      component: () =>
        import(`../views/${item.component}/index.vue`).catch((error) => {
          console.error(`动态导入组件 ${item.component} 失败:`, error)
        }),
    }


    return route
  })
}

/**
 * 设置动态路由
 */
// 在 setupDynamicRoutes 函数中保存路由信息到 localStorage
export async function setupDynamicRoutes() {


  // 从 localStorage 中读取路由列表
  const routerList = JSON.parse(localStorage.getItem('routerList')) || []


  // 提取所有 children 数据
  const childrenRoutes = routerList.flatMap((item) => item.children || [])


  // 生成路由
  const dynamicRoutes = generateRoutes(childrenRoutes)


  // 清空 home 路由的 children，避免重复添加
  const homeRoute = router.getRoutes().find((route) => route.name === 'home')
  if (homeRoute) {
    homeRoute.children = []
  }

  // 将动态路由添加到 home 路由的 children 中
  dynamicRoutes.forEach((route) => {
    if (route) {

      router.addRoute('home', route) // 将路由添加到 'home' 路由下
    }
  })


}

// 在应用启动时调用 setupDynamicRoutes
setupDynamicRoutes()

/**
 * 全局前置守卫
 */
router.beforeEach(async (to, from, next) => {
  const userLoginStore = useUserLoginStore()
  const token = userLoginStore.token || localStorage.getItem('token')

  // 如果用户未登录且尝试访问非登录页面，则重定向到登录页面
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    // 如果用户已登录，重新设置动态路由
    if (token && !userLoginStore.routerList.length) {
      await userLoginStore.setRouterList()
      await setupDynamicRoutes()
    }
    next() // 放行
  }
})

export default router
