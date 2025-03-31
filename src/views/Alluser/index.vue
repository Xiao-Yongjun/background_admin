<template>
  <div class="container">
    <!-- 增加角色按钮 -->
    <el-button type="primary" class="add-button" @click="handleAdd">增加角色</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" class="custom-table">
      <el-table-column prop="phone" label="手机号" width="180" />
      <el-table-column prop="status" label="角色" width="180">
        <template #default="scope">
          {{ getRoleName(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="user_pic" label="头像">
        <template #default="scope">
          <el-image class="avatar-image" :src="scope.row.user_pic" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="link" size="small" class="action-button" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="link" size="small" class="action-button delete-button"
            @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改表单 -->
    <el-dialog v-model="dialogVisible" title="修改用户信息" class="custom-dialog">
      <el-form :model="form">
        <el-form-item label="手机号">
          <el-input v-model="form.phone" class="custom-input" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.status" placeholder="请选择角色" class="custom-select">
            <el-option label="游客" :value="0" />
            <el-option label="普通用户" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload action="#" :on-change="(file) => handleUploadChange(file, 'form')" :before-upload="beforeUpload"
            :limit="1" :auto-upload="false" class="avatar-upload">
            <el-button type="primary" class="upload-button">点击上传</el-button>
            <template #tip>
              <div class="upload-tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
          <el-image v-if="form.user_pic" class="avatar-preview" :src="form.user_pic" fit="cover"></el-image>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" class="dialog-button">取消</el-button>
        <el-button type="submit" @click="handleSave" class="dialog-button primary-button">保存</el-button>
      </template>
    </el-dialog>

    <!-- 新增角色表单 -->
    <el-dialog v-model="addDialogVisible" title="新增角色" class="custom-dialog">
      <el-form :model="newForm" ref="addFormRef" :rules="rules">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="newForm.phone" class="custom-input" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newForm.password" type="password" class="custom-input" />
        </el-form-item>
        <el-form-item label="角色" prop="status">
          <el-select v-model="newForm.status" placeholder="请选择角色" class="custom-select">
            <el-option label="游客" :value="0" />
            <el-option label="普通用户" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload action="#" :on-change="(file) => handleUploadChange(file, 'newForm')" :before-upload="beforeUpload"
            :limit="1" :auto-upload="false" class="avatar-upload">
            <el-button type="primary" class="upload-button">点击上传</el-button>
            <template #tip>
              <div class="upload-tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
          <el-image v-if="newForm.user_pic" class="avatar-preview" :src="newForm.user_pic" fit="cover"></el-image>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false" class="dialog-button">取消</el-button>
        <el-button type="primary" @click="handleAddSave" class="dialog-button primary-button">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserList, deleteUser, updateUser, register } from '../../api/user';
import { ElMessageBox, ElMessage } from 'element-plus';

// 表单验证规则
const validatePhone = (rule, value, callback) => {
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (!phoneReg.test(value)) {
    callback(new Error('手机号格式不正确'));
  } else {
    callback();
  }
};

const validatePassword = (rule, value, callback) => {
  const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,8}$/;
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (!passwordReg.test(value)) {
    callback(new Error('密码必须是3-8位的数字加字母'));
  } else {
    callback();
  }
};

const validateStatus = (rule, value, callback) => {
  if (value === undefined || value === null) {
    callback(new Error('请选择角色'));
  } else if (![0, 1, 2].includes(value)) {
    callback(new Error('角色只能是游客、普通用户或超级管理员'));
  } else {
    callback();
  }
};

const rules = {
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  status: [{ required: true, validator: validateStatus, trigger: 'change' }],
};

// 用户列表数据
const tableData = ref([]);

// 获取用户列表
const getUser = async () => {
  let res = await getUserList();
  tableData.value = res.data.data;
};

// 初始化加载用户列表
onMounted(() => {
  getUser();
});

// 修改表单相关
const dialogVisible = ref(false);
const form = ref({
  id: null,
  phone: '',
  user_pic: '',
  status: null,
});

// 打开修改表单
const handleEdit = (row) => {
  form.value = { ...row };
  dialogVisible.value = true;
};

// 保存修改
const handleSave = async () => {
  try {
    await ElMessageBox.confirm('确定保存修改吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    let res = await updateUser(form.value);
    if (res.data.status == 0) {
      ElMessage.success('修改成功');
      getUser();
      dialogVisible.value = false;
    } else {
      ElMessage.error('修改失败: ' + res.data.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
    ElMessage.error('请求出错: ' + error.message);
  }
};

// 删除用户
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    let res = await deleteUser(id);
    if (res.data.status == 1) {
      ElMessage.error('删除失败: ' + res.data.message);
    }
    else {
      getUser();
      ElMessage.success('删除成功');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 新增表单相关
const addDialogVisible = ref(false);
const newForm = ref({
  phone: '',
  user_pic: '',
  status: 0,
  password: '',
});
const addFormRef = ref(null);

// 打开新增表单
const handleAdd = () => {
  newForm.value = {
    phone: '',
    user_pic: '',
    status: 0,
    password: '',
  };
  addDialogVisible.value = true;
};

const handleAddSave = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      register(newForm.value)
        .then((res) => {
          if (res.data.status == 0) {
            ElMessage.success('新增成功');
            getUser();
            newForm.value = {
              phone: '',
              user_pic: '',
              status: 0,
              password: '',
            };
            addDialogVisible.value = false;
          } else {
            ElMessage.error('新增失败: ' + res.data.message);
          }
        })
        .catch((error) => {
          console.error('请求出错:', error);
          ElMessage.error('请求出错: ' + error.message);
        });
    } else {
      ElMessage.error('请检查表单填写是否正确');
    }
  });
};

// 头像上传处理
const handleUploadChange = (file, formType) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (formType === 'form') {
      form.value.user_pic = e.target.result;
    } else if (formType === 'newForm') {
      newForm.value.user_pic = e.target.result;
    }
  };
  reader.readAsDataURL(file.raw);
};

// 头像上传前的校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt500KB = file.size / 1024 < 500;

  if (!isImage) {
    ElMessage.error('只能上传图片文件');
    return false;
  }
  if (!isLt500KB) {
    ElMessage.error('图片大小不能超过500KB');
    return false;
  }
  return true;
};

// 角色名称映射
const getRoleName = (status) => {
  switch (status) {
    case 0:
      return '游客';
    case 1:
      return '普通用户';
    case 2:
      return '超级管理员';
    default:
      return '未知';
  }
};
</script>

<style scoped lang="scss">
/* 整体容器样式 */
.container {
  padding: 30px;
  background-color: #f4f7fa;
  max-width: 1200px;
  margin: 30px auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 增加角色按钮样式 */
.add-button {
  margin-bottom: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
}

/* 表格样式 */
.custom-table {
  :deep(.el-table) {
    background-color: white;
    color: #333;
    border-radius: 10px;
    overflow: hidden;

    :deep(th.el-table__cell) {
      background-color: #e9ecef;
      color: #555;
      font-weight: 600;
      padding: 15px;
    }

    :deep(tr) {
      &:hover :deep(td) {
        background-color: #f1f3f5;
      }
    }

    :deep(td.el-table__cell) {
      border-bottom-color: #e9ecef;
      padding: 15px;
    }

    :deep(.el-table__row--striped td) {
      background-color: #f9fafb;
    }
  }
}

/* 头像样式 */
.avatar-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

/* 操作按钮样式 */
.action-button {
  color: #007bff;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: #0056b3;
  }
}

.delete-button {
  color: #dc3545;

  &:hover {
    color: #bd2130;
  }
}

/* 对话框样式 */
.custom-dialog {
  border-radius: 10px;

  :deep(.el-dialog__header) {
    background-color: #f8f9fa;
    padding: 20px;
    border-bottom: 1px solid #e9ecef;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    padding: 20px;
    text-align: right;
    border-top: 1px solid #e9ecef;
  }
}

/* 输入框和选择框样式 */
.custom-input,
.custom-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
}

/* 头像上传样式 */
.avatar-upload {
  margin-bottom: 20px;

  :deep(.el-upload) {
    border: 1px dashed #ced4da;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s ease;

    &:hover {
      border-color: #007bff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #868e96;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 5px;
    object-fit: cover;
    margin-top: 10px;
  }
}

/* 上传按钮样式 */
.upload-button {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
}

/* 上传提示样式 */
.upload-tip {
  color: #868e96;
  font-size: 12px;
  margin-top: 5px;
}

/* 对话框按钮样式 */
.dialog-button {
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 16px;

  &.primary-button {
    background-color: #007bff;
    border-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }
  }
}
</style>
