<template>
  <div class="user-info-container">
    <h1 class="title">我的信息</h1>
    <div class="info-section" v-if="!isEditing">
      <div class="info-block animated fadeIn">
        <div class="info-row">
          <label>用户名:</label>
          <span @click="startEditing">{{ user.phone }}</span>
        </div>
        <div class="info-row">
          <label>头像:</label>
          <img :src="user.user_pic" alt="用户头像" @click="startEditing">
        </div>
        <div class="info-row">
          <label>角色身份:</label>
          <span @click="startEditing">{{ user.status === 0 ? '游客' : user.status === 1 ? '普通用户' : '超级管理员' }}</span>
        </div>
        <button class="edit-button" @click="startEditing">修改信息</button>
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
            <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </div>
          <div class="info-row">
            <label>角色身份:</label>
            <select v-model="user.status">
              <option value="0">游客</option>
              <option value="1">普通用户</option>
              <option value="2">超级管理员</option>
            </select>
          </div>
          <div class="info-row">
            <label>旧密码:</label>
            <input v-model="oldPwd" :type="showOldPwd ? 'text' : 'password'">
            <button type="button" @click="toggleShowOldPwd">
              {{ showOldPwd ? '隐藏' : '显示' }}
            </button>
          </div>
          <div class="info-row">
            <label>新密码:</label>
            <input v-model="newPwd" :type="showNewPwd ? 'text' : 'password'">
            <button type="button" @click="toggleShowNewPwd">
              {{ showNewPwd ? '隐藏' : '显示' }}
            </button>
          </div>
          <div class="button-group">
            <button type="submit" class="save-button">保存修改</button>
            <button type="button" @click="cancelEditing" class="cancel-button">取消修改</button>
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

onMounted(() => {
  imageUrl.value = user.value.user_pic;
  getuserinfo()
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
      ElMessage.error('用户信息更新失败！');
    }
  } catch (error) {
    ElMessage.error('请求出错：' + error.message);
  }
};
</script>

<style scoped>
body {
  background-color: #0a192f;
  font-family: 'Roboto', sans-serif;
  color: #ccd6f6;
}

.user-info-container {
  padding: 40px;
  border: 1px solid #112240;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  margin: 20px auto;
  background-color: #112240;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.title {
  text-align: center;
  color: #64ffda;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
}

.info-section {
  margin-bottom: 20px;
}

.info-block {
  padding: 20px;
  border: 1px solid #233554;
  border-radius: 10px;
  background-color: #0a192f;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.info-row label {
  width: 120px;
  font-weight: bold;
  color: #8892b0;
}

.info-row input,
.info-row select {
  padding: 10px;
  border: 1px solid #233554;
  border-radius: 5px;
  flex: 1;
  background-color: #0a192f;
  color: #ccd6f6;
  transition: all 0.3s ease;
}

.info-row input:focus,
.info-row select:focus {
  border-color: #64ffda;
  outline: none;
  transform: scale(1.02);
}

.info-row img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #64ffda;
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
  transition: transform 0.3s ease;
}

.info-row img:hover {
  transform: scale(1.1);
}

.edit-button,
.save-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.edit-button {
  background-color: #64ffda;
  color: #0a192f;
  align-self: center;
}

.save-button {
  background-color: #28a745;
  color: white;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.edit-button:hover,
.save-button:hover,
.cancel-button:hover {
  filter: brightness(120%);
  transform: scale(1.05);
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #64ffda;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.avatar-uploader .el-upload:hover {
  border-color: #64ffda;
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
  transform: scale(1.1);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #64ffda;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animated {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

.fadeIn {
  animation-name: fadeIn;
}

.zoomIn {
  animation-name: zoomIn;
}
</style>
