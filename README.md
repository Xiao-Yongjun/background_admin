# Admin Background System

A full-stack admin dashboard solution with Vue 3 frontend and Node.js backend, featuring comprehensive permission management, data visualization, and CRUD operations.

## Frontend Technology Stack

- **Framework**: Vue 3 + Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Components**: Element Plus
- **Data Visualization**: ECharts
- **HTTP Client**: Axios
- **Rich Text Editor**: (Specify if you used one like WangEditor or Tiptap)
- **Other Libraries**: 
  - VueUse (utility collection)
  - Day.js (date handling)

## Backend Technology Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MySQL
- **Authentication**: JWT (Token-based)
- **Middleware**: Custom auth/validation middleware
- **Security**: CORS protection

## Key Features

### Frontend
- **Permission Management**: Dynamic routing based on user roles
- **Data Visualization**: Interactive charts/dashboards with ECharts
- **Authentication**: JWT token handling with Axios interceptors
- **Rich Text Editing**: WYSIWYG editor for content management
- **Pagination**: Custom pagination components for data tables
- **CRUD Operations**: Comprehensive data management interfaces
- **Responsive Design**: Adapts to different screen sizes

### Backend
- **RESTful API**: Structured endpoints for frontend consumption
- **Token Authentication**: JWT generation and verification
- **Role-Based Access**: Middleware for route protection
- **Database Operations**: Efficient MySQL queries with connection pooling
- **Error Handling**: Unified error response system
- **Request Validation**: Input sanitization and validation
- **CORS Management**: Secure cross-origin resource sharing

## Project Setup

### Frontend
```sh
pnpm install
pnpm dev  # Development
pnpm build  # Production
pnpm lint  # Code quality check
