<template>
  <div class="login-container">
    <div class="left-section">
      <img src="../../assets/01.webp" alt="Login Background" />
    </div>
    <div class="right-section">
      <el-card class="login-card">
        <!-- 手机号登录 -->
        <div v-if="activeTab === 0">
          <div class="password-login">
            <h1>手机号登录</h1>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="auto">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="loginForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
              </el-form-item>
              <el-form-item>
                <el-button :loading="isLoading" type="primary" round class="submit-button" @click="handleSubmit">
                  提交
                </el-button>
                <el-button type="info" round class="cancel-button" @click="handleReset">
                  取消
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 二维码登录 -->
        <div v-if="activeTab === 1">
          <div class="qr-login">
            <h1>二维码登录</h1>
            <img src="../../assets/二维码.png" alt="QR Code" class="qr-code" />
            <el-button :loading="isLoading" @click="handleQRLogin">尝试登录</el-button>
          </div>
        </div>

        <!-- 登录方式切换 -->
        <div class="login-method-switch">
          <el-button :class="{ active: activeTab === 0 }" @click="switchLoginMethod(0)">
            手机号登录
          </el-button>
          <el-button :class="{ active: activeTab === 1 }" @click="switchLoginMethod(1)">
            二维码登录
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import useUserLoginStore from '../../stores/user'
import { setupDynamicRoutes } from '../../router/index'

const router = useRouter()
const userLogin = useUserLoginStore()

// 表单引用
const loginFormRef = ref(null)

// 表单数据
const loginForm = reactive({
  phone: '',
  password: '',
})

// 当前激活的登录方式（0: 手机号登录, 1: 二维码登录）
const activeTab = ref(0)

// 加载状态
const isLoading = ref(false)

// 手机号验证规则
const validatePhone = (rule, value, callback) => {
  const reg = /^1[3-9]\d{9}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('手机号格式错误'))
  }
}

// 密码验证规则
const validatePassword = (rule, value, callback) => {
  const reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{1,8}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('密码必须为8位数并且包含字母和数字'))
  }
}

// 表单验证规则
const loginRules = reactive({
  phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
})

// 切换登录方式
const switchLoginMethod = (method) => {
  activeTab.value = method
}

// 提交表单
import { login } from '../../api/user'
const handleSubmit = async () => {
  isLoading.value = true;
  try {
    // 使用 Promise 封装 validate 方法
    const valid = await new Promise((resolve) => {
      loginFormRef.value.validate((isValid) => resolve(isValid));
    });

    if (!valid) {
      ElMessage.error('请检查输入内容');
      return; // 直接返回，避免继续执行
    }

    const res = await login(loginForm);
    if (res.data.status === 0) {
      userLogin.setToken(res.data.token);
      await userLogin.setRouterList(); // 确保路由列表设置完成
      await setupDynamicRoutes(); // 确保动态路由添加完成
      await router.push('/home/myinfo'); // 确保路由添加完成后再进行导航
      ElMessage.success('登录成功');
    } else {
      ElMessage.error('登录失败：' + res.data.message); // 处理其他状态码
    }
  } catch (error) {
    console.error('登录请求出错:', error);
    ElMessage.error('登录请求出错，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 重置表单
const handleReset = () => {
  loginFormRef.value.resetFields()
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;

  .left-section,
  .right-section {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .left-section {
    width: 60%;

    img {
      width: 98%;
      height: 98%;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .right-section {
    width: 40%;

    .login-card {
      width: 80%;
      height: 600px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      background-color: #ffffff;
      padding: 20px;

      .password-login,
      .qr-login {
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #303133;
          font-size: 24px;
        }

        .el-form-item {
          margin-bottom: 20px;
        }

        .el-input {
          border-radius: 8px;
        }

        .submit-button,
        .cancel-button {
          width: 48%;
          border-radius: 20px;
          font-weight: bold;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
          }
        }

        .submit-button {
          background-color: rgba(64, 158, 255, 0.8);
          border: 1px solid rgba(64, 158, 255, 0.5);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);

          &:hover {
            background-color: rgba(102, 177, 255, 0.9);
            box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
          }
        }

        .cancel-button {
          background-color: rgba(144, 147, 153, 0.8);
          border: 1px solid rgba(144, 147, 153, 0.5);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(144, 147, 153, 0.3);

          &:hover {
            background-color: rgba(166, 169, 173, 0.9);
            box-shadow: 0 6px 20px rgba(144, 147, 153, 0.5);
          }
        }
      }

      .qr-code {
        width: 100%;
        height: 400px;
        border-radius: 10px;
      }

      .login-method-switch {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;

        .el-button {
          border-radius: 20px;
          transition: background-color 0.3s ease, color 0.3s ease;

          &.active,
          &:hover {
            background-color: #409eff;
            color: #ffffff;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;

    .left-section,
    .right-section {
      width: 100%;
      height: auto;
    }

    .left-section {
      img {
        width: 100%;
        height: auto;
      }
    }

    .right-section {
      .login-card {
        width: 90%;
        height: auto;
        padding: 15px;

        .password-login,
        .qr-login {
          height: auto;
        }

        .qr-code {
          height: 300px;
        }
      }
    }
  }
}
</style>
