<template>
  <div class="dark-dashboard">
    <div class="dashboard-header">
      可视化大屏
    </div>
    <div class="dashboard-content">
      <el-row :gutter="20">
        <el-col :span="12" class="dashboard-column">
          <el-card class="dark-card">
            <div class="card-header">
              <span class="card-title">商品总数：</span>
              <span class="card-value">666</span>
            </div>
            <div class="card-body">
              <div class="metric-grid">
                <div class="metric-item" v-for="item in 3" :key="item">
                  <Edit class="metric-icon" />
                  <span class="metric-value">6,666</span>
                </div>
              </div>
            </div>
          </el-card>

          <el-card class="dark-card">
            <div class="card-header">
              <span class="card-title">搜索统计</span>
              <Search class="search-icon" />
            </div>
            <div class="card-body">
              <div id="search-chart" style="width: 100%; height: 300px;"></div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12" class="dashboard-column">
          <el-card class="dark-card chart-card">
            <div class="card-header">
              <span class="card-title">访问来源</span>
            </div>
            <div class="card-body">
              <div id="main" style="width: 100%; height: 400px;"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import { Edit, Search } from '@element-plus/icons-vue';

// 初始化图表
onMounted(() => {
  // 右侧饼图
  const chartDom = document.getElementById('main');
  const myChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: '#e0e0e0'
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
            color: '#e0e0e0'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '电子产品' },
          { value: 735, name: '科技产品' },
          { value: 580, name: '农业产品' },
          { value: 484, name: '校园产品' },
          { value: 300, name: '水果' }
        ],
        itemStyle: {
          color: function (params) {
            const colorList = ['#42a5f5', '#66bb6a', '#ffa726', '#26c6da', '#7e57c2'];
            return colorList[params.dataIndex];
          }
        }
      }
    ]
  };

  myChart.setOption(option);

  // 搜索统计图表
  const searchChartDom = document.getElementById('search-chart');
  const searchChart = echarts.init(searchChartDom);

  const searchOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      axisLabel: {
        color: '#a0a0a0'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      axisLabel: {
        color: '#a0a0a0'
      },
      splitLine: {
        lineStyle: {
          color: '#333'
        }
      }
    },
    series: [
      {
        name: 'Search Count',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: '#42a5f5'
        }
      }
    ]
  };

  searchChart.setOption(searchOption);

  // 响应式调整
  window.addEventListener('resize', function () {
    myChart.resize();
    searchChart.resize();
  });
});
</script>

<style lang="scss" scoped>
@keyframes slideIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.dark-dashboard {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #e0e0e0;

  .dashboard-header {
    max-width: 600px;
    height: 60px;
    margin: 0 auto 30px;
    border: 1px solid rgba(66, 165, 245, 0.3);
    text-align: center;
    border-radius: 12px;
    line-height: 60px;
    box-shadow: 0 4px 12px rgba(66, 165, 245, 0.2);
    animation: slideIn 0.6s ease-out;
    background: linear-gradient(135deg, rgba(30, 39, 50, 0.8), rgba(40, 52, 70, 0.8));
    font-size: 26px;
    font-weight: 500;
    color: #e0e0e0;
  }

  .dashboard-content {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;

    .dashboard-column {
      padding: 0 15px;

      .dark-card {
        border-radius: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        transition: transform 0.3s, box-shadow 0.3s;
        margin-bottom: 20px;
        background-color: #1a1a1a;
        border: 1px solid #333;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(66, 165, 245, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #333;

          .card-title {
            font-size: 18px;
            color: #a0a0a0;
          }

          .card-value {
            font-size: 24px;
            font-weight: bold;
            color: #42a5f5;
          }

          .search-icon {
            width: 20px;
            height: 20px;
            color: #42a5f5;
          }
        }

        .card-body {
          padding: 20px;

          .metric-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;

            .metric-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 15px;
              border-radius: 8px;
              background-color: #252525;
              transition: background-color 0.3s;
              border: 1px solid #333;

              &:hover {
                background-color: #2e2e2e;
              }

              .metric-icon {
                width: 24px;
                height: 24px;
                margin-bottom: 8px;
                color: #42a5f5;
              }

              .metric-value {
                font-size: 18px;
                font-weight: 600;
                color: #e0e0e0;
              }
            }
          }
        }
      }

      .chart-card {
        height: 100%;
        background-color: #1a1a1a;
      }
    }
  }
}
</style>
