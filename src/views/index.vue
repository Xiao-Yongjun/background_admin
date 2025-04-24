<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  Setting,
  InfoFilled,
  Menu as MenuIcon,
  Sunny,
  Moon,
  Message,
  Files, Goods
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

// 主题切换
const isLightMode = ref(false)
const toggleTheme = () => {
  isLightMode.value = !isLightMode.value
  document.body.classList.toggle('light-mode', isLightMode.value)
}

// 图标映射函数
const getIcon = (name) => {
  switch (name) {
    case '用户管理':
      return InfoFilled
    case '系统设置':
      return Setting
    case '公告':
      return Message
    case '可视化':
      return Files
    case '商品':
      return Goods
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
        <div class="header-center">
          <div @click="toggleTheme" class="theme-switch">
            <div class="switch-track" :class="{ 'light-mode': isLightMode }">
              <div class="switch-thumb">
                <el-icon v-if="isLightMode">
                  <Sunny />
                </el-icon>
                <el-icon v-else>
                  <Moon />
                </el-icon>
              </div>
            </div>
          </div>
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
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: var(--transition-all);
}

.sidebar {
  background-color: var(--block-bg);
  color: var(--text-color);
  transition: width 0.3s ease;
  box-shadow: var(--shadow-md);
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: var(--text-md);
  font-weight: bold;
  background-color: var(--block-bg);
  cursor: pointer;
  color: var(--primary);
  text-shadow: 0 0 5px var(--glow-color);
  transition: var(--transition-all);
}

.menu {
  border-right: none;
  background-color: var(--block-bg);
  color: var(--text-color);
  transition: var(--transition-all);

  span {
    color: var(--text-color);
  }
}

.el-menu-item.is-active {
  background-color: rgba(129, 230, 217, 0.1);
  color: var(--primary);
}

.el-menu-item {
  background-color: rgba(129, 230, 217, 0.05);
  transition: var(--transition-all);
}

.el-menu-item:hover {
  background-color: rgba(129, 230, 217, 0.2);
  color: var(--primary);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--block-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0 var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
}

.header-left {
  flex: 1;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-md);
}

.header-left .el-breadcrumb {
  line-height: 60px;

  :deep(.el-breadcrumb__inner) {
    color: var(--text-color);
    transition: var(--transition-all);
  }

  :deep(.el-breadcrumb__separator) {
    color: var(--label-color);
  }
}

.username {
  margin-left: var(--space-sm);
  color: var(--text-color);
}

.main-content {
  background-color: var(--bg-color);
  padding: var(--space-lg);
  transition: var(--transition-all);
}

.el-dropdown-menu {
  background-color: var(--block-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);

  :deep(.el-dropdown-menu__item) {
    color: var(--text-color);
    transition: var(--transition-all);

    &:hover {
      background-color: rgba(129, 230, 217, 0.1);
      color: var(--primary);
    }
  }
}

.theme-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 5px;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--hover-bg);
  }

  .switch-track {
    width: 80px;
    /* 加宽轨道 */
    height: 34px;
    /* 增加高度 */
    border-radius: 17px;
    /* 匹配新高度 */
    background-color: var(--bg-color-secondary);
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--border-color);
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.1),
      0 0 0 0 rgba(var(--primary-rgb), 0);

    &.light-mode {
      background-color: #f0f0f0;
    }

    .switch-thumb {
      position: absolute;
      width: 30px;
      /* 增大圆形按钮 */
      height: 30px;
      /* 增大圆形按钮 */
      border-radius: 50%;
      background-color: var(--primary);
      top: 1px;
      left: 1px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.2),
        0 0 10px rgba(var(--primary-rgb), 0);

      .el-icon {
        font-size: 16px;
        /* 增大图标 */
        transition: transform 0.3s ease;
      }
    }

    &.light-mode .switch-thumb {
      left: calc(100% - 31px);
      /* 调整位置 */
      background-color: #ffc107;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.2),
        0 0 10px rgba(255, 193, 7, 0);
    }
  }

  &:hover .switch-track {
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.2),
      0 0 8px rgba(var(--primary-rgb), 0.2);

    .switch-thumb {
      transform: scale(1.05);
    }

    &.light-mode {
      box-shadow:
        inset 0 1px 3px rgba(0, 0, 0, 0.2),
        0 0 8px rgba(255, 193, 7, 0.3);
    }
  }

  &:active .switch-thumb {
    width: 32px;
  }

  &:active .switch-track {
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.2),
      0 0 15px rgba(var(--primary-rgb), 0.4);

    &.light-mode {
      box-shadow:
        inset 0 1px 3px rgba(0, 0, 0, 0.2),
        0 0 15px rgba(255, 193, 7, 0.5);
    }

    .switch-thumb {
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.2),
        0 0 15px rgba(var(--primary-rgb), 0.6);

      .el-icon {
        transform: scale(1.1);
      }
    }

    &.light-mode .switch-thumb {
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.2),
        0 0 15px rgba(255, 193, 7, 0.7);
    }
  }
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: var(--text-color);
  transition: var(--transition-all);

  &:hover {
    color: var(--primary);
  }
}
</style>
