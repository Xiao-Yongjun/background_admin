# Admin Background System

**（通用后台管理系统）** A full-stack admin dashboard solution with Vue 3 frontend and Node.js backend, featuring comprehensive permission management, data visualization, and CRUD operations.

## Frontend Technology Stack **（前端技术栈）**

- **Framework**: Vue 3 + Vite **（新一代Vue开发构建工具）**
- **State Management**: Pinia **（Vue官方推荐的状态管理库）**
- **Routing**: Vue Router **（前端路由管理）**
- **UI Components**: Element Plus **（基于Vue 3的UI组件库）**
- **Data Visualization**: ECharts **（百度开源图表库）**
- **HTTP Client**: Axios **（Promise-based HTTP客户端）**
- **Rich Text Editor**: (如使用请注明，例如WangEditor/Tiptap) **（富文本编辑器）**
- **Other Libraries**: 
  - VueUse **（Vue组合式API实用工具集）**
  - Day.js **（轻量级日期处理库）**

## Backend Technology Stack **（后端技术栈）**

- **Runtime**: Node.js **（JavaScript运行时环境）**
- **Framework**: Express **（Node.js Web框架）**
- **Database**: MySQL **（关系型数据库）**
- **Authentication**: JWT (Token-based) **（基于Token的身份验证）**
- **Middleware**: Custom auth/validation middleware **（自定义中间件）**
- **Security**: CORS protection **（跨域安全防护）**

## Key Features **（核心功能）**

### Frontend **（前端）**
- **Permission Management**: Dynamic routing based on user roles **（基于角色的动态路由）**
- **Data Visualization**: Interactive charts/dashboards with ECharts **（交互式数据看板）**
- **Authentication**: JWT token handling with Axios interceptors **（Axios拦截器实现Token自动处理）**
- **Rich Text Editing**: WYSIWYG editor for content management **（所见即所得的富文本编辑）**
- **Pagination**: Custom pagination components for data tables **（自定义数据分页组件）**
- **CRUD Operations**: Comprehensive data management interfaces **（完整的数据增删改查界面）**
- **Responsive Design**: Adapts to different screen sizes **（响应式布局适配多端）**

### Backend **（后端）**
- **RESTful API**: Structured endpoints for frontend consumption **（符合REST规范的API设计）**
- **Token Authentication**: JWT generation and verification **（JWT令牌生成与验证）**
- **Role-Based Access**: Middleware for route protection **（基于角色的路由保护中间件）**
- **Database Operations**: Efficient MySQL queries with connection pooling **（使用连接池的MySQL高效查询）**
- **Error Handling**: Unified error response system **（统一的错误响应系统）**
- **Request Validation**: Input sanitization and validation **（输入消毒与验证）**
- **CORS Management**: Secure cross-origin resource sharing **（安全的跨域资源共享配置）**

## Project Setup **（项目安装）**

### Frontend **（前端）**
```sh
pnpm install   # 安装依赖
pnpm dev       # 开发模式
pnpm build     # 生产环境构建
pnpm lint      # 代码质量检查
