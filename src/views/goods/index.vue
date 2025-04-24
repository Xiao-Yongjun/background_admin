<template>
  <div class="product-container">
    <!-- 搜索框 -->
    <el-card class="search-box">
      <div class="search-content">
        <el-input v-model="searchQuery" placeholder="请输入商品名称" clearable class="search-input" @keyup.enter="handleSearch"
          @input="debouncedSearch"></el-input>
        <el-button type="primary" class="search-button" @click="handleSearch">
          <el-icon>
            <Search />
          </el-icon>
          搜索
        </el-button>
      </div>
    </el-card>

    <!-- 商品分类导航 -->
    <el-card class="category-nav">
      <el-button type="primary" plain @click="handleOpen">
        <el-icon>
          <Plus />
        </el-icon>
        新增商品
      </el-button>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane :label="item.name" v-for="item in goodsCategory" :key="item.id"
          :name="item.id.toString()"></el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 当前分类标题 -->
    <el-card class="category-title">
      <h2>{{ currentCategoryName }}</h2>
      <span class="product-count" v-if="listType === 'search'">
        搜索关键词：{{ searchQuery }}
      </span>
      <span class="product-count">共 {{ totalCount }} 件商品</span>
    </el-card>

    <!-- 商品列表 -->
    <el-card class="product-list">
      <el-empty v-if="goodsList.length === 0" :description="listType === 'search' ? '未找到相关商品' : '暂无商品数据'"></el-empty>

      <el-row :gutter="20" v-else>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in goodsList" :key="item.id" class="product-col">
          <el-card class="product-item" shadow="hover">
            <div class="product-image">
              <div class="image-container">
                <img v-if="item.pic" :src="item.pic" :alt="item.name" @error="handleImageError">
                <div v-else class="image-placeholder">
                  <el-icon :size="40">
                    <Picture />
                  </el-icon>
                  <span>暂无图片</span>
                </div>
              </div>
              <el-tag :type="item.status === 0 ? 'success' : 'danger'" class="product-tag"
                :class="{ 'active': item.status === 1 }" effect="dark">
                {{ item.status === 0 ? "在售" : '缺货' }}
              </el-tag>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ item.name }}</h3>
              <p class="product-desc">{{ item.descript || '暂无描述' }}</p>
              <div class="product-meta">
                <div class="product-price">
                  <span class="current-price">¥{{ item.price.toFixed(2) }}</span>
                  <span class="original-price" v-if="item.originalPrice">
                    ¥{{ item.originalPrice.toFixed(2) }}
                  </span>
                </div>
                <div class="product-stock">库存: {{ item.count }}</div>
              </div>
              <div class="product-actions">
                <el-button type="danger" size="small" @click.stop="handleDelete(item.id)"
                  :loading="deleteLoading === item.id">
                  删除
                </el-button>
                <el-button type="primary" size="small" @click.stop="handleEdit(item)">
                  编辑
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <div class="pagination" v-if="totalCount > 0">
        <el-pagination v-model:current-page="currentPage" :total="totalCount" :page-size="5"
          layout="total, prev, pager, next, jumper" background @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '新增商品'" width="600px" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" label-position="left">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品描述" prop="descript">
          <el-input v-model="form.descript" type="textarea" :rows="3" placeholder="请输入商品描述" maxlength="200"
            show-word-limit />
        </el-form-item>

        <el-form-item label="商品图片" prop="pic">
          <el-input v-model="form.pic"></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格(元)" prop="price">
              <el-input-number v-model="form.price" :min="0.01" :precision="2" :step="0.1" controls-position="right" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="库存数量" prop="count">
              <el-input-number v-model="form.count" :min="0" :step="1" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="在售" :value="0" />
                <el-option label="缺货" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="商品分类" prop="parent_id">
          <el-select v-model="form.parent_id" placeholder="请选择商品分类" clearable>
            <el-option v-for="item in goodsCategory" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="formLoading">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Plus,
  Picture
} from '@element-plus/icons-vue'
import {
  getGoods_category,
  getGoods_list,
  getGoods_add,
  getGoods_del,
  getGoods_update,
  getGoods_search
} from '@/api/goods'


// 新增：区分列表类型
const listType = ref('category') // 'category' | 'search'

// 数据状态
const searchQuery = ref('')
const activeTab = ref('')
const currentPage = ref(1)
const totalCount = ref(0)
const goodsCategory = ref([])
const goodsList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentGoodsId = ref('')
const formLoading = ref(false)
const deleteLoading = ref(null)

// 表单数据
const form = ref({
  name: '',
  descript: '',
  pic: '',
  price: 0,
  originalPrice: 0,
  count: 0,
  status: 0,
  parent_id: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  descript: [
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  count: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'integer', min: 0, message: '库存不能为负数', trigger: 'blur' }
  ],
  parent_id: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ]
}

// 计算属性
const currentCategoryName = computed(() => {
  if (listType.value === 'search') {
    return `搜索结果：${searchQuery.value}`
  }
  const category = goodsCategory.value.find(item => item.id.toString() === activeTab.value)
  return category ? category.name : '全部'
})

// 方法
const fetchGoodsCategory = async () => {
  try {
    const res = await getGoods_category()
    goodsCategory.value = res.data.data || []
    if (goodsCategory.value.length > 0) {
      activeTab.value = goodsCategory.value[0].id.toString()
      fetchGoodsList()
    }
  } catch (error) {

    ElMessage.error('获取分类失败')
  }
}

const fetchGoodsList = async () => {
  try {
    let res
    if (listType.value === 'search' && searchQuery.value) {
      res = await getGoods_search({
        keyword: searchQuery.value,
        page: currentPage.value,
        pageSize: 5
      })
    } else {
      listType.value = 'category'
      const params = {
        parent_id: activeTab.value,
        page: currentPage.value,
        pageSize: 5
      }
      res = await getGoods_list(params)
    }
    console.log(res.data);

    goodsList.value = res.data.data || []
    totalCount.value = res.data.total || 0


  } catch (error) {
    ElMessage.error('获取商品列表失败')
  }
}

// 修改搜索方法
const handleSearch = () => {
  if (!searchQuery.value) {
    listType.value = 'category'
    if (goodsCategory.value.length > 0) {
      activeTab.value = goodsCategory.value[0].id.toString()
    }
  } else {
    listType.value = 'search'
  }
  currentPage.value = 1
  fetchGoodsList()
}


const handleTabClick = () => {
  listType.value = 'category'
  currentPage.value = 1
  fetchGoodsList()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchGoodsList()
}

const handleOpen = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (item) => {
  isEdit.value = true
  currentGoodsId.value = item.id
  form.value = {
    name: item.name,
    descript: item.descript,
    pic: item.pic,
    price: item.price,
    count: item.count,
    status: item.status,
    parent_id: item.parent_id
  }
  dialogVisible.value = true
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该商品吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    deleteLoading.value = id
    try {
      const res = await getGoods_del(id)
      if (res.data.status === 1) {
        ElMessage.success('删除成功')
        fetchGoodsList()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    } finally {
      deleteLoading.value = null
    }
  }).catch(() => { })
}



const handleImageError = (e) => {
  e.target.src = '' // 清空错误图片
}

const resetForm = () => {
  form.value = {
    name: '',
    descript: '',
    pic: '',
    price: 0,
    count: 0,
    status: 0,
    parent_id: goodsCategory.value[0]?.id || ''
  }
}

const submitForm = async () => {
  formLoading.value = true
  try {
    let res
    if (isEdit.value) {
      res = await getGoods_update({
        id: currentGoodsId.value,
        ...form.value
      })
    } else {
      res = await getGoods_add(form.value)
    }

    if (res.data.status === 0) {
      ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
      dialogVisible.value = false
      fetchGoodsList()
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败' : '新增失败')
  } finally {
    formLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchGoodsCategory()
})
</script>

<style scoped lang="scss">
.product-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-lg);
  background-color: var(--bg-color);
  color: var(--text-color);
}

.search-box {
  margin-bottom: var(--space-lg);
  background: linear-gradient(145deg, var(--block-bg), var(--bg-color));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  .search-content {
    display: flex;
    gap: var(--space-sm);
    padding: var(--space-md);

    .search-input {
      flex: 1;
      background: var(--input-bg);
      border: none;
      border-radius: var(--radius-sm);
      color: var(--text-color);
      padding: var(--space-sm);
      transition: var(--transition-all);

      &:focus {
        background: var(--input-bg);
        box-shadow: 0 0 var(--space-sm) rgba(0, 255, 255, 0.3);
      }
    }

    .search-button {
      width: 120px;
      background: linear-gradient(45deg, var(--primary-color), var(--primary-light-color));
      border: none;
      border-radius: var(--radius-sm);
      color: var(--text-color);
      font-weight: bold;
      transition: transform var(--transition-all);

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 var(--space-lg) rgba(0, 255, 255, 0.5);
      }
    }
  }
}

.category-nav {
  margin-bottom: var(--space-lg);
  background: linear-gradient(145deg, var(--block-bg), var(--bg-color));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  :deep(.el-button) {
    background: linear-gradient(45deg, var(--primary-color), var(--primary-light-color));
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-color);
    font-weight: bold;
    transition: transform var(--transition-all);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 var(--space-lg) rgba(0, 255, 255, 0.5);
    }
  }

  :deep(.el-tabs__item) {
    color: var(--text-color);
    border-bottom: 2px solid transparent;

    &.is-active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
  }
}

.category-title {
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--space-sm);

  h2 {
    margin: 0;
    font-size: var(--text-xl);
    color: var(--text-color);
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  }

  .product-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }
}

.product-list {
  .product-col {
    margin-bottom: var(--space-lg);

    .product-item {
      height: 100%;
      border-radius: var(--radius-lg);
      background: linear-gradient(145deg, var(--block-bg), var(--bg-color));
      box-shadow: var(--shadow-md);
      transition: var(--transition-all);

      &:hover {
        transform: translateY(calc(-1 * var(--space-sm)));
        box-shadow: 0 var(--space-sm) var(--space-lg) rgba(0, 255, 255, 0.3);
      }

      .product-image {
        position: relative;
        height: 0;
        padding-bottom: 100%;
        overflow: hidden;

        .image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--input-bg);
          transition: transform var(--transition-all);

          &:hover {
            transform: scale(1.05);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.9;
            transition: opacity var(--transition-all);
          }

          .image-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);

            .el-icon {
              margin-bottom: var(--space-sm);
              color: var(--border-color);
              font-size: var(--text-2xl);
            }
          }
        }

        .product-tag {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
          z-index: 1;
          background: rgba(0, 255, 255, 0.1);
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
        }

        .active {
          color: var(--bg-color);
          background-color: rgba(255, 0, 127, 0.2);
        }
      }

      .product-info {
        padding: var(--space-md);

        .product-name {
          margin: 0 0 var(--space-sm);
          font-size: var(--text-lg);
          color: var(--text-color);
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
        }

        .product-desc {
          margin: 0 0 var(--space-md);
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.6;
        }

        .product-meta {
          margin-bottom: var(--space-md);

          .product-price {
            display: flex;
            align-items: center;
            margin-bottom: var(--space-xs);

            .current-price {
              font-size: var(--text-xl);
              color: var(--primary-color);
              font-weight: bold;
            }

            .original-price {
              font-size: var(--text-sm);
              color: var(--text-muted);
              text-decoration: line-through;
              margin-left: var(--space-sm);
            }
          }

          .product-stock {
            font-size: var(--text-xs);
            color: var(--text-muted);
          }
        }

        .product-actions {
          display: flex;
          gap: var(--space-sm);

          .el-button {
            flex: 1;
            background: linear-gradient(45deg, var(--danger-color), var(--danger-light-color));
            border: none;
            border-radius: var(--radius-sm);
            color: var(--text-color);
            font-weight: bold;
            transition: transform var(--transition-all);

            &:hover {
              transform: scale(1.05);
              box-shadow: 0 0 var(--space-lg) rgba(255, 0, 127, 0.5);
            }
          }
        }
      }
    }
  }

  .pagination {
    margin-top: var(--space-xl);
    display: flex;
    justify-content: center;

    :deep(.el-pagination) {
      color: var(--text-color);

      :deep(.el-pager li) {
        background: var(--input-bg);
        border-radius: var(--radius-sm);
        margin: 0 var(--space-xs);

        &.active {
          background: linear-gradient(45deg, var(--primary-color), var(--primary-light-color));
          color: var(--text-color);
        }
      }
    }
  }
}

// 对话框样式
:deep(.el-dialog) {
  background-color: var(--block-bg);
  color: var(--text-color);

  :deep(.el-dialog__title) {
    color: var(--text-color);
    border-bottom: 2px solid var(--border-color);
  }

  :deep(.el-form-item__label) {
    color: var(--text-color);
  }

  :deep(.el-input) {
    background: var(--input-bg);
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-color);

    &:focus {
      background: var(--input-bg);
      box-shadow: 0 0 var(--space-sm) rgba(0, 255, 255, 0.3);
    }
  }

  :deep(.el-button) {
    background: linear-gradient(45deg, var(--primary-color), var(--primary-light-color));
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-color);
    font-weight: bold;
    transition: transform var(--transition-all);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 var(--space-lg) rgba(0, 255, 255, 0.5);
    }
  }
}
</style>
