import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style/main.css'
const pinia = createPinia()
const app = createApp(App)
import '@wangeditor/editor/dist/css/style.css' // 引入 css
// main.ts

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.devtools = false
app.config.productionTip = false
import { setupDynamicRoutes } from './router'
// 在应用启动时重新添加动态路由

app.use(pinia)
app.use(router)
app.use(ElementPlus)

setupDynamicRoutes().then(() => {
  app.mount('#app')
})
