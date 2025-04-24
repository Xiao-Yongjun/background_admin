<template>
  <div class="editor-container">
    <div class="border border-gray-300 rounded-md overflow-hidden">
      <Toolbar class="border-b border-gray-300 bg-gray-50 p-2" :editor="editorRef" :defaultConfig="toolbarConfig"
        :mode="mode" />
      <Editor class="h-96 overflow-y-auto p-4" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>
    <div class="publish-button mt-4 flex justify-end">
      <el-button type="primary" :loading="publishing" @click="handlePublish"
        class="px-6 py-3 text-lg font-medium rounded-md">
        发布文章
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const editorRef = shallowRef()
const valueHtml = ref('<p>hello</p>')
const publishing = ref(false)

// 工具栏配置（保持不变）
const toolbarConfig = {
  excludeKeys: ['emotion', 'group-video'],
  insertKeys: {
    index: 5,
    keys: ['uploadImage']
  }
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 移除 server 配置
      fieldName: 'file',
      maxFileSize: 5 * 1024 * 1024, // 5M
      allowedFileTypes: ['image/*'],

      // 修改后的自定义上传方法
      customUpload(file, insertFn) {
        // 创建FileReader读取文件
        const reader = new FileReader()

        // 读取成功回调
        reader.onload = (e) => {
          const base64Url = e.target.result
          insertFn(base64Url, file.name, base64Url) // 插入Base64格式
          ElMessage.success('图片已插入')
        }

        // 读取失败回调
        reader.onerror = (error) => {
          ElMessage.error('图片读取失败，请重试')
          console.error('文件读取错误:', error)
        }

        // 开始读取文件
        reader.readAsDataURL(file)
      },

      // 保持错误处理（用于处理文件大小/类型错误）
      onError(file, err) {
        let message = '上传失败'
        if (err.message.includes('maxFileSize')) {
          message = '图片大小不能超过5M'
        } else if (err.message.includes('file type')) {
          message = '仅支持图片文件'
        }
        ElMessage.error(message)
      }
    }
  }
}

// 发布逻辑保持不变
const handlePublish = async () => {
  if (!valueHtml.value.trim()) {
    return ElMessage.warning('内容不能为空')
  }

  try {
    publishing.value = true
    // 这里可以添加本地保存逻辑（如果需要）
    ElMessage.success('发布成功')
    router.push({})
  } catch (error) {
    ElMessage.error(`发布失败: ${error.message}`)
  } finally {
    publishing.value = false
  }
}

// 以下部分保持不变
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  editor && editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor
}

const mode = 'default'
</script>

<style scoped lang="scss">
.editor-container {
  position: relative;
  max-width: var(--max-width);
  margin: var(--space-lg) auto;
  padding: var(--space-md);
  background-color: var(--bg-color);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-md);
}

.editor-container .publish-button {
  margin-top: var(--space-md);
  display: flex;
  justify-content: flex-end;
}

.editor-container .publish-button .el-button {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-lg);
  font-weight: 500;
  border-radius: var(--radius-md);
}

:deep(.w-e-bar) {
  background-color: var(--toolbar-bg-color);
  display: flex;
  flex-wrap: wrap;
}

:deep(.w-e-text-container) {
  background-color: var(--editor-bg-color);
  min-height: 24rem;
}
</style>
