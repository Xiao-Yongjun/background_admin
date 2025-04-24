<template>
  <div class="container">
    <h1>所有公告</h1>
    <ul class="announcement-list">
      <li v-for="announcement in announcements" :key="announcement.id" @click="toggleDetails(announcement)"
        :class="{ 'expanded': selectedId === announcement.id }" class="announcement-item">
        <div class="item-header">
          <h2 class="item-title">{{ announcement.title }}</h2>
          <div class="item-meta">
            <span>发布者: {{ announcement.publisher }}</span>
            <span>发布时间: {{ announcement.publishTime }}</span>
          </div>
        </div>
        <p class="item-content">{{ announcement.content }}</p>
        <div v-if="selectedId === announcement.id" class="expanded-content">
          {{ announcement.content }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const announcements = ref([
  {
    id: 1,
    title: '系统维护通知',
    content: '为提高服务质量，我们将于2024年2月20日凌晨1:00至5:00进行系统升级维护。届时平台将暂停服务，请提前做好工作安排。升级内容包括：1. 数据库性能优化 2. 安全补丁更新 3. 用户界面改进。如有任何问题请联系客服支持。',
    publisher: '运维部',
    publishTime: '2024-02-18 14:30'
  },
  {
    id: 2,
    title: '春节假期服务安排',
    content: '根据国务院办公厅通知，结合我司实际情况，2024年春节假期安排如下：2月9日（除夕）至2月15日（初六）放假调休，共7天。2月17日（星期六）正常上班。假期期间将安排值班人员，紧急问题请联系：400-123-4567。恭祝大家新春快乐！',
    publisher: '行政部',
    publishTime: '2024-02-05 09:00'
  },
  {
    id: 3,
    title: '新产品发布：智能分析工具正式上线',
    content: '我们很高兴地宣布，新一代数据智能分析平台V3.0正式发布！主要新功能包括：1. 增强型可视化仪表盘 2. 自动化报表生成 3. 实时数据流分析 4. 多维度数据钻取。立即访问控制台体验新功能，前30天可免费试用高级功能。',
    publisher: '产品部',
    publishTime: '2024-02-19 10:15'
  }
]);

const selectedId = ref(null);

const toggleDetails = (announcement) => {
  if (selectedId.value === announcement.id) {
    selectedId.value = null;
  } else {
    selectedId.value = announcement.id;
  }
};
</script>

<style scoped lang="scss">
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl);
}

h1 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-color);
  text-align: center;
  margin-bottom: var(--space-xl);
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 4rem;
    height: 3px;
    background: var(--primary);
    margin: var(--space-md) auto 0;
    border-radius: var(--radius-sm);
  }
}

.announcement-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-lg);
}

.announcement-item {
  background: var(--block-bg);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &.expanded {
    background-color: rgba(129, 230, 217, 0.05);
  }
}

.item-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.item-title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  transition: var(--transition-all);

  .announcement-item:hover & {
    color: var(--primary);
  }
}

.item-meta {
  display: flex;
  gap: var(--space-lg);
  font-size: var(--text-sm);
  color: var(--label-color);
}

.item-content {
  color: var(--text-color);
  margin: 0;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.9;
}

.expanded .item-content {
  -webkit-line-clamp: unset;
  overflow: visible;
}

.expanded-content {
  color: var(--text-color);
  line-height: 1.8;
  font-size: var(--text-md);
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--border-color);
  animation: fadeIn 0.3s ease-out;
}
</style>
