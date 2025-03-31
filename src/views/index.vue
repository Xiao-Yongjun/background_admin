<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  Setting,
  InfoFilled,
  Menu as MenuIcon
} from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'
import useUserStore from '../stores/user'

const $router = useRouter()
const route = useRoute()

// 当前激活的菜单
const activeMenu = ref('')

// 当前路由名称
const currentRouteName = computed(() => route.meta.title || route.name)

// 菜单选择事件
const handleMenuSelect = (index) => {
  try {
    $router.push(index)
    activeMenu.value = index
  } catch (error) {
    console.error('路由跳转出错:', error)
  }
}

// 侧边栏折叠状态
const isCollapse = ref(false)
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 用户信息
const userStore = useUserStore()
const user = ref({})

// 获取用户信息
const getpic = () => {
  try {
    if (userStore.user) {
      user.value = userStore.user
    }
  } catch (error) {
    console.error('获取用户信息出错:', error)
  }
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      try {
        userStore.removeUser()
        userStore.removeToken()
        $router.push('/login')
      } catch (error) {
        console.error('退出登录出错:', error)
      }
    })
    .catch(() => {
      // 用户点击了取消，不执行任何操作
    })
}

// 动态菜单数据
const menuData = computed(() => {
  return userStore.routerList.map((item) => ({
    id: item.id,
    category_nickname: item.category_nickname,
    icon: getIcon(item.category_nickname),
    children: item.children.map((child) => ({
      id: child.id,
      path: `/home/${child.path}`,
      nickname: child.nickname,
      icon: getIcon(child.nickname)
    }))
  }))
})

// 图标映射函数
const getIcon = (name) => {
  switch (name) {
    case '用户管理':
      return InfoFilled
    case '系统设置':
      return Setting
    default:
      return HomeFilled
  }
}

// 查找匹配的菜单项路径
const findMatchingPath = () => {
  const currentPath = route.path
  for (const item of menuData.value) {
    for (const child of item.children) {
      if (child.path === currentPath) {
        return child.path
      }
    }
  }
  return ''
}

// 监听路由变化，更新激活菜单
watch(() => route.path, () => {
  activeMenu.value = findMatchingPath()
})

onMounted(() => {
  getpic()
  activeMenu.value = findMatchingPath()
})
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo" @click="toggleSidebar">
        <span v-if="!isCollapse">后台管理系统</span>
        <el-icon v-else>
          <MenuIcon />
        </el-icon>
      </div>
      <el-menu v-model="activeMenu" router class="menu" :collapse="isCollapse" @select="handleMenuSelect">
        <!-- 动态生成菜单 -->
        <template v-for="item in menuData" :key="item.id">
          <el-sub-menu :index="item.id.toString()">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span class="nickname">{{ item.category_nickname }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.id" :index="child.path">
              <el-icon>
                <component :is="child.icon" />
              </el-icon>
              {{ child.nickname }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="30" :src="user.user_pic ||
                'https://img1.baidu.com/it/u=1427964794,3304363802&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750'
                " />
              <span class="username">{{ user.phone }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/home/myinfo')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  background-color: #121212;
  /* 深黑色背景 */
  color: #00ffea;
  /* 科技感的青色文字 */
}

.sidebar {
  background-color: #1e1e1e;
  /* 侧边栏深灰色背景 */
  color: #00ffea;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 234, 0.3);
  /* 侧边栏光影效果 */
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background-color: #2b2f3a;
  cursor: pointer;
  color: #00ffea;
  text-shadow: 0 0 10px rgba(0, 255, 234, 0.7);
  /* 文字光影效果 */
}

.menu {
  border-right: none;
  background-color: #1e1e1e;
  /* 与侧边栏背景颜色一致 */
  color: #00ffea;
  /* 与整体文字颜色一致 */
  span{
    color: #00ffea;
  }
}


.el-menu-item.is-active {
  background-color: rgba(0, 255, 234, 0.1);
  /* 激活菜单项背景颜色与原设计协调 */
  color: #00ffea;
  /* 激活菜单项文字颜色与整体一致 */
}
.el-menu-item{
  background-color: rgba(0, 255, 234, 0.5);
}

.el-menu-item:hover {
  background-color: rgba(0, 255, 234, 0.2);
  /* 菜单项悬停背景颜色稍深 */
  color: #00ffea;
  /* 菜单项悬停文字颜色与整体一致 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  /* 顶部导航栏深灰色背景 */
  border-bottom: 1px solid #00ffea;
  /* 底部边框颜色 */
  padding: 0 20px;
  box-shadow: 0 0 10px rgba(0, 255, 234, 0.3);
  /* 顶部导航栏光影效果 */
}

.header-left .el-breadcrumb {
  line-height: 60px;
}

.header-right {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 10px;
}

.main-content {
  background-color: #121212;
  padding: 20px;
  box-shadow: inset 0 0 10px rgba(0, 255, 234, 0.3);
  /* 内容区光影效果 */
}

.el-dropdown-menu {
  background-color: #1e1e1e;
  /* 下拉菜单背景 */
  border: 1px solid #00ffea;
  /* 下拉菜单边框 */
  box-shadow: 0 0 10px rgba(0, 255, 234, 0.3);
  /* 下拉菜单光影效果 */
}

.el-dropdown-item {
  color: #00ffea;
  /* 下拉菜单项文字颜色 */
}

.el-dropdown-item:hover {
  background-color: rgba(0, 255, 234, 0.1);
  /* 下拉菜单项悬停背景 */
}
</style>
