<template>
  <div class="container">
    <div class="left-panel">
      <el-button @click="handleAddFirstRouter" type="primary" class="add-button">新增一级路由</el-button>
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-menu-item index="2" v-for="item in routeDataFirst" :key="item.id" @click="getTwoRouter(item)">
          <el-icon><icon-menu /></el-icon>
          <span>{{ item.category_nickname }}</span>
          <div class="action-buttons">
            <el-button @click="handleEditFirstRouter(item)" type="text">编辑</el-button>
            <el-button @click="handleDeleteFirstRouter(item)" type="text">删除</el-button>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-panel">
      <el-button type="primary" @click="handleAdd" class="add-button">新增二级路由</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="id" width="180" />
        <el-table-column prop="path" label="路径" width="180" />
        <el-table-column prop="component" label="组件" />
        <el-table-column prop="nickname" label="别名" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 1">用户</el-tag>
            <el-tag type="warning" v-if="scope.row.status === 0">游客</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 2">超级管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parent_id" label="父路由">
          <template #default="scope">
            {{ getParentRouteName(scope.row.parent_id) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="link" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="link" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="500" align-center>
    <template #default>
      <el-form>
        <el-form-item label="路径">
          <el-input v-model="form.path" placeholder="请输入路由路径"></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="form.component" placeholder="请输入组件"></el-input>
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="form.nickname" placeholder="请输入路由别名"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form.status">
            <el-option label="游客" :value="0" />
            <el-option label="用户" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="上一级路由">
          <el-select v-model="form.parent_id">
            <el-option v-for="item in routeDataFirst" :key="item.id" :label="item.category_nickname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 一级路由数据 -->
  <el-dialog v-model="FirstdialogVisible" title="选择一级路由" width="500" :before-close="handleClose">
    <template #default>
      <el-form :model="FirestForm">
        <el-form-item label="路径">
          <el-input v-model="FirestForm.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="FirestForm.component" placeholder="组件"></el-input>
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="FirestForm.category_nickname" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="FirestForm.status">
            <el-option label="游客" :value="0" />
            <el-option label="用户" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="SubmitEventFirest">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus' // 引入 Element Plus 的消息提示组件
const centerDialogVisible = ref(false) // 初始值为 false
const dialogTitle = ref('新增二级路由') // 对话框标题
const isEditMode = ref(false) // 是否为编辑模式
//编辑一级路由的开关
const FirstdialogVisible = ref(false) // 初始值为 false
const FirestForm = ref({
  path: '',
  component: '',
  category_nickname: '',
  status: 1,
})
//删除一级路由的开关
const handleDeleteFirstRouter = async (item) => {
  let res = await deleteRouterMangeApi(item.id) // 调用删除接口

  if (res.data.status === 0) {
    ElMessage.success('删除成功')
    // 删除成功后重新获取一级路由数据
    await getRouteFirst()
  } else {
    ElMessage.error('删除失败，请重试')
  }
}
const handleEditFirstRouter = (item) => {
  FirestForm.value = item
  FirstdialogVisible.value = true // 打开一级路由选择对话框
  isEditMode.value = true // 切换为编辑模式
}
const handleAddFirstRouter = () => {
  FirstdialogVisible.value = true // 打开一级路由选择对话框
  isEditMode.value = false // 切换为新增模式
  FirestForm.value = {
    path: '',
    component: '',
    category_nickname: '',
    status: 1,
  }
}

import {
  routerMangeApi, getSecondRouter, updateSecondRouter, deleteSecondRouter,
  addSecondRouter, addRouterMangeApi, updateRouterMangeApi, deleteRouterMangeApi
} from '../../api/routerMange'
//提交一级路由选择
const SubmitEventFirest = async () => {
  console.log(FirestForm.value)
  let res = '';
  if (isEditMode.value) {
    // 编辑模式下调用更新接口
    res = await updateRouterMangeApi(FirestForm.value)
  } else {
    // 新增模式下调用新增接口
    res = await addRouterMangeApi(FirestForm.value)
  }

  console.log(res);

  if (res.data.status === 0) {
    ElMessage.success(isEditMode.value ? '更新成功' : '新增成功')
    FirstdialogVisible.value = false
    // 操作成功后重新获取一级路由数据
    await getRouteFirst()
  } else {
    ElMessage.error(isEditMode.value ? '更新失败，请重试' : '新增失败，请重试')
  }
}

//新增二级路由按钮点击事件
const handleAdd = async () => {
  dialogTitle.value = '新增二级路由'
  isEditMode.value = false
  form.value = {
    path: '',
    component: '',
    nickname: '',
    status: 1, // 默认值为 1（用户）
    id: '',
    parent_id: currentFirstRouteId.value, // 默认父级路由为当前选中的一级路由
  }
  centerDialogVisible.value = true // 打开对话框
}

//删除按钮点击事件
const handleDelete = async (scoped) => {
  let res = await deleteSecondRouter(scoped.row.id) // 调用删除接口

  if (res.data.status === 0) {
    ElMessage.success('删除成功')
    // 删除成功后重新获取二级路由数据
    if (currentFirstRouteId.value) {
      await getTwoRouter({ id: currentFirstRouteId.value })
    }
  } else {
    ElMessage.error('删除失败，请重试')
  }
}

// 表单数据
const form = ref({
  path: '',
  component: '',
  nickname: '',
  status: 1, // 默认值为 1（用户）
  id: '',
  parent_id: '',
})

// 一级路由数据
const routeDataFirst = ref([])
// 当前选中的一级路由 ID
const currentFirstRouteId = ref(null)

// 根据 parent_id 获取父路由名称
const getParentRouteName = (parentId) => {
  const parentRoute = routeDataFirst.value.find(item => item.id == parentId)
  return parentRoute ? parentRoute.category_nickname : '无'
}

// 编辑按钮点击事件
const handleEdit = (scoped) => {
  dialogTitle.value = '编辑二级路由'
  isEditMode.value = true
  form.value = { ...scoped.row } // 将当前行的数据赋值给表单
  centerDialogVisible.value = true // 打开对话框
}

// 确认按钮点击事件
const handleConfirm = async () => {
  try {
    let res
    if (isEditMode.value) {
      res = await updateSecondRouter(form.value) // 调用更新接口
    } else {
      res = await addSecondRouter(form.value) // 调用新增接口
    }

    console.log(res);

    if (res.data.status === 0) {
      ElMessage.success(isEditMode.value ? '更新成功' : '新增成功') // 提示用户操作成功
      centerDialogVisible.value = false // 关闭对话框
      // 操作成功后重新获取二级路由数据
      if (currentFirstRouteId.value) {
        await getTwoRouter({ id: currentFirstRouteId.value })
      }
    } else {
      ElMessage.error(isEditMode.value ? '更新失败，请重试' : '新增失败，请重试') // 提示用户操作失败
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请检查网络或稍后重试') // 提示用户操作失败
  }
}

// 表格数据
const tableData = ref([])
const getTwoRouter = async (item) => {
  try {
    let res = await getSecondRouter({ parent_id: item.id, status: item.status })
    tableData.value = res.data.data
    // 更新当前选中的一级路由 ID
    currentFirstRouteId.value = item.id
    // 检查响应数据结构是否符合预期
    if (res.data.status === 0) {
      return res.data.data
    } else {
      console.error('返回的数据结构不符合预期')
      return null
    }
  } catch (error) {
    console.error('获取二级路由数据失败:', error)
    return null
  }
}

// 获取一级路由数据
const getRouteFirst = async () => {
  try {
    let res = await routerMangeApi()
    routeDataFirst.value = res.data.data
    // 默认加载第一个一级路由的二级路由数据
    if (routeDataFirst.value.length > 0) {
      await getTwoRouter(routeDataFirst.value[0])
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  getRouteFirst()
})
</script>

<style scoped lang="scss">
/* 全局样式 */
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.left-panel {
  flex: 1;
  min-width: 250px;
  background-color: #2c2b2b;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  span{
    color: #ce1e73;
  }
}

.right-panel {
  flex: 3;
  background-color: #645e5e;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-button {
  margin-bottom: 20px;
}

.el-menu-vertical-demo {
  border-right: none;
  background-color: transparent;
}

.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  height: auto;
  line-height: normal;
  font-size: 14px;
  color: #303133;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.el-menu-item:hover {
  background-color: #ecf5ff;
}

.el-menu-item .action-buttons {
  display: flex;
  gap: 10px;
}

.el-table {
  margin-top: 20px;
}

.el-table .el-tag {
  margin-right: 5px;
}

.el-dialog {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.el-dialog__header {
  border-bottom: 1px solid #ebeef5;
  padding: 20px;
  font-weight: bold;
}

.el-dialog__body {
  padding: 20px;
}

.el-dialog__footer {
  border-top: 1px solid #ebeef5;
  padding: 20px;
  text-align: right;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: bold;
}

.el-input,
.el-select {
  width: 100%;
}

.el-button {
  margin-right: 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button--text {
  color: #409eff;
}

.el-button--text:hover {
  color: #66b1ff;
}

.el-tag {
  margin-right: 5px;
}

.el-tag--success {
  background-color: #4fdc02;
  border-color: #e1f3d8;
  color: #67c23a;
}

.el-tag--warning {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

.el-tag--danger {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}
</style>
