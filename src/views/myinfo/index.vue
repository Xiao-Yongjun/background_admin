<template>
  <div class="user-info-container ">
    <div class="theme-toggle">

    </div>
    <h1 class="title glow">我的信息</h1>
    <div class="info-section" v-if="!isEditing">
      <div class="info-block animated fadeIn">
        <div class="info-row">
          <label>用户名:</label>
          <span @click="startEditing">{{ user.phone }}</span>
        </div>
        <div class="info-row">
          <label>头像:</label>
          <img :src="user.user_pic" alt="用户头像" @click="startEditing" class="glow-hover">
        </div>
        <div class="info-row">
          <label>角色身份:</label>
          <span @click="startEditing">{{ user.status === 0 ? '游客' : user.status === 1 ? '普通用户' : '超级管理员' }}</span>
        </div>
        <button class="edit-button pulse" @click="startEditing">修改信息</button>
      </div>
    </div>
    <div class="info-section" v-else>
      <div class="info-block animated zoomIn">
        <form @submit.prevent="saveChanges">
          <div class="info-row">
            <label>用户名:</label>
            <input v-model="user.phone" type="text" disabled>
          </div>
          <div class="info-row">
            <label>头像:</label>
            <el-upload class="avatar-uploader glow-hover" :show-file-list="false" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </div>
          <div class="info-row">
            <label>角色身份:</label>
            <select v-model="user.status" class="glow-focus">
              <option value="0">游客</option>
              <option value="1">普通用户</option>
              <option value="2">超级管理员</option>
            </select>
          </div>
          <div class="info-row">
            <label>旧密码:</label>
            <input v-model="oldPwd" :type="showOldPwd ? 'text' : 'password'" class="glow-focus">
            <button type="button" @click="toggleShowOldPwd" class="glow-hover">
              {{ showOldPwd ? '隐藏' : '显示' }}
            </button>
          </div>
          <div class="info-row">
            <label>新密码:</label>
            <input v-model="newPwd" :type="showNewPwd ? 'text' : 'password'" class="glow-focus">
            <button type="button" @click="toggleShowNewPwd" class="glow-hover">
              {{ showNewPwd ? '隐藏' : '显示' }}
            </button>
          </div>
          <div class="button-group">
            <button type="submit" class="save-button glow-button">保存修改</button>
            <button type="button" @click="cancelEditing" class="cancel-button glow-button">取消修改</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useUserStore from '../../stores/user';
import { updateUser } from '../../api/user';
import { ElUpload, ElIcon, ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getuser } from '../../api/user'

const userStore = useUserStore();
const getuserinfo = async () => {
  let res = await getuser()
  console.log(res.data.data);
  user.value = res.data.data
  userStore.setUser(res.data.data)
}

const user = ref({ ...userStore.user });
const imageUrl = ref(user.value.user_pic);
const isEditing = ref(false);
const oldPwd = ref('');
const newPwd = ref('');
const showOldPwd = ref(false);
const showNewPwd = ref(false);
const isLightMode = ref(false);

onMounted(() => {
  imageUrl.value = user.value.user_pic;
  getuserinfo();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isLightMode.value = savedTheme === 'light';
  }
});



const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  user.value = { ...userStore.user };
  imageUrl.value = user.value.user_pic;
  oldPwd.value = '';
  newPwd.value = '';
  isEditing.value = false;
};

const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式！');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB！');
    return false;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    imageUrl.value = reader.result;
    user.value.user_pic = reader.result;
  };
  reader.onerror = () => {
    ElMessage.error('图片读取失败，请重试！');
  };

  return false;
};

const toggleShowOldPwd = () => {
  showOldPwd.value = !showOldPwd.value;
};
const toggleShowNewPwd = () => {
  showNewPwd.value = !showNewPwd.value;
};

const saveChanges = async () => {
  if (oldPwd.value && newPwd.value) {
    if (oldPwd.value === newPwd.value) {
      ElMessage.error('新密码不能与旧密码相同！');
      return;
    }
  }

  try {
    const response = await updateUser({
      ...user.value,
      oldPwd: oldPwd.value,
      newPwd: newPwd.value,
    });

    if (response) {
      ElMessage.success('用户信息更新成功！');
      getuserinfo();
      userStore.setUser(user.value);
      cancelEditing();
    } else {
      Emessage.error('用户信息更新失败！');
    }
  } catch (error) {
    ElMessage.error('请求出错：' + error.message);
  }
};
</script>

<style scoped>
.user-info-container {
  padding: var(--space-xxl);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  width: 80%;
  max-width: 600px;
  margin: var(--space-lg) auto;
  background-color: var(--bg-color);
  box-shadow: var(--shadow-md);
  transition: var(--transition-all);
  position: relative;
}

.title {
  text-align: center;
  color: var(--primary);
  margin-bottom: var(--space-xl);
  font-size: var(--text-lg);
  font-weight: 600;
}

.info-section {
  margin-bottom: var(--space-lg);
}

.info-block {
  padding: var(--space-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background-color: var(--block-bg);
  box-shadow: var(--shadow-sm);
}

.info-row {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
}

.info-row label {
  width: 120px;
  font-weight: 500;
  color: var(--label-color);
}

.info-row span {
  color: var(--text-color);
  flex: 1;
  padding: var(--space-sm) 0;
}

.info-row input,
.info-row select {
  padding: var(--space-sm);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  flex: 1;
  background-color: var(--input-bg);
  color: var(--text-color);
  transition: var(--transition-all);
}

.info-row input:disabled {
  background-color: var(--disabled-bg);
  color: var(--disabled-text);
}

.info-row img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--radius-full);
  border: 2px solid var(--primary);
  transition: var(--transition-all);
  cursor: pointer;
}

.edit-button,
.save-button,
.cancel-button {
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-all);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.edit-button {
  background-color: var(--primary);
  color: var(--dark-bg-color);
  display: block;
  margin: var(--space-lg) auto 0;
}

.save-button {
  background-color: var(--success-color);
  color: white;
}

.cancel-button {
  background-color: var(--danger-color);
  color: white;
}

.button-group {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  margin-top: var(--space-lg);
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-all);
  background-color: rgba(129, 230, 217, 0.1);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: var(--primary);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 密码显示/隐藏按钮样式 */
.info-row button[type="button"] {
  padding: 8px 12px;
  background-color: var(--input-border);
  color: var(--text-color);
  border: none;
  border-radius: var(--radius-sm);
  margin-left: var(--space-sm);
  cursor: pointer;
  transition: background-color 0.2s;
}

/* 悬停发光效果 */
.glow-hover:hover {
  box-shadow: 0 0 15px var(--glow-color),
    0 0 25px rgba(129, 230, 217, 0.4),
    0 0 35px rgba(129, 230, 217, 0.2);
  transform: scale(1.05);
}

/* 聚焦发光效果 */
.glow-focus:focus {
  box-shadow: 0 0 8px var(--glow-color);
  outline: none;
}

/* 按钮发光效果 */
.glow-button {
  position: relative;
  overflow: hidden;
}

.glow-button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(to bottom right,
      rgba(255, 255, 255, 0) 45%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 55%);
  transform: rotate(30deg);
  opacity: 0;
  transition: all 0.5s ease;
}

.glow-button:hover::after {
  opacity: 0.6;
  left: 100%;
  top: 100%;
}

/* 主题切换按钮 */
.theme-toggle {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
}

.theme-button {
  padding: 6px 12px;
  border: none;
  border-radius: 20px;
  background-color: var(--block-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition-all);
  font-size: var(--text-sm);
}

.theme-button:hover {
  transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-info-container {
    width: 95%;
    padding: var(--space-lg);
  }

  .theme-toggle {
    position: static;
    margin-bottom: var(--space-md);
    display: flex;
    justify-content: flex-end;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .info-row label {
    width: 100%;
  }

  .button-group {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .glow {
    animation: glow 3s ease-in-out infinite alternate;
  }
}
</style>
