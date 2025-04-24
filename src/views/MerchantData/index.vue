<template>
  <div class="MerchantData">
    <el-row :gutter="20">
      <el-col :span="24" class="header">
        <div class="header-content">
          <h2>商家数据概览</h2>
          <el-icon :size="24" class="calendar-icon">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor"
                d="M128 384v512h768V192H256v128h-64V128h128V64h64v64h256V64h64v64h128v768a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h192v64H128v256zm0 256h192v192H128v-192zm256 0h192v192H384v-192zm256 0h192v192H640v-192zM384 640h192v192H384v-192zm256 0h192v192H640v-192zM128 640h192v192H128v-192zm192-256h192v192H320V384zm256 0h192v192H576V384zm-256 0h192v192H320V384z" />
            </svg>
          </el-icon>
          <span class="date-range">2023年6月1日 - 2023年6月30日</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">
          <div class="Incomechart" id="line-chart"></div>
          <div class="Piechart" id="pie-chart"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="Barchart" id="bar-chart"></div>
      </el-col>
    </el-row>
  </div>
</template>


<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';

onMounted(() => {
  initLineChart();
  initPieChart();
  initBarChart();
});

const initLineChart = () => {
  const chartDom = document.getElementById('line-chart');
  const myChart = echarts.init(chartDom);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '网店周收入趋势',
      left: 'center',
      textStyle: {
        color: '#e0e0e0',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#2a2a2a',
      borderColor: '#444',
      textStyle: {
        color: '#e0e0e0'
      },
      formatter: '{b}<br/>收入: <span style="color:#42a5f5">{c}</span> 元'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      backgroundColor: 'rgba(30, 30, 30, 0.5)',
      borderColor: 'rgba(80, 80, 80, 0.3)'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      },
      axisLabel: {
        color: '#a0a0a0'
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: '#555'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '收入(元)',
      nameTextStyle: {
        color: '#a0a0a0'
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      },
      axisLabel: {
        color: '#a0a0a0',
        formatter: '{value}'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(80, 80, 80, 0.5)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: [5820, 7320, 6920, 10340, 8920, 15320, 12680],
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#42a5f5',
          borderColor: '#0f0f0f',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(66, 165, 245, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 5
        },
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(66, 165, 245, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(66, 165, 245, 0.05)'
            }
          ])
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值', symbolSize: 50 },
            { type: 'min', name: '最小值', symbolSize: 50 }
          ],
          label: {
            color: '#fff'
          }
        }
      }
    ]
  };

  myChart.setOption(option);
  window.addEventListener('resize', () => myChart.resize());
};

const initPieChart = () => {
  const chartDom = document.getElementById('pie-chart');
  const myChart = echarts.init(chartDom);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '网店流量来源',
      left: 'center',
      textStyle: {
        color: '#e0e0e0',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#2a2a2a',
      borderColor: '#444',
      textStyle: {
        color: '#e0e0e0'
      },
      formatter: '{a} <br/>{b}: <span style="color:{color}">{c}</span> ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#a0a0a0'
      },
      itemGap: 10,
      itemWidth: 12,
      itemHeight: 12
    },
    series: [
      {
        name: '流量来源',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#1a1a1a',
          borderWidth: 2,
          color: function (params) {
            const colorList = ['#42a5f5', '#66bb6a', '#ffa726', '#26c6da', '#7e57c2'];
            return colorList[params.dataIndex];
          }
        },
        label: {
          show: false,
          position: 'center',
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold'
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 3840, name: '搜索引擎' },
          { value: 2680, name: '直接访问' },
          { value: 1980, name: '社交媒体' },
          { value: 1540, name: '广告推广' },
          { value: 920, name: '邮件营销' }
        ]
      }
    ]
  };

  myChart.setOption(option);
  window.addEventListener('resize', () => myChart.resize());
};

const initBarChart = () => {
  const chartDom = document.getElementById('bar-chart');
  const myChart = echarts.init(chartDom);

  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const products = ['智能手机', '笔记本电脑', '智能手表', '无线耳机', '平板电脑', '相机'];

  const generateData = (month) => {
    return products.map(product => {
      return {
        product: product,
        value: Math.round(Math.random() * 500 + 100),
        month: month
      };
    }).sort((a, b) => b.value - a.value);
  };

  const productColors = {
    '智能手机': '#FF6384',
    '笔记本电脑': '#36A2EB',
    '智能手表': '#FFCE56',
    '无线耳机': '#4BC0C0',
    '平板电脑': '#9966FF',
    '相机': '#FF9F40'
  };

  let currentMonthIndex = 0;

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '热销商品动态排名',
      left: 'center',
      textStyle: {
        color: '#e0e0e0',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#2a2a2a',
      borderColor: '#444',
      textStyle: {
        color: '#e0e0e0'
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(150, 150, 150, 0.1)'
        }
      },
      formatter: function (params) {
        return `${params[0].data.product}<br/>销量: <span style="color:${params[0].color}">${params[0].data.value}</span>件<br/>月份: ${params[0].data.month}`;
      }
    },
    grid: {
      top: 80,
      bottom: 30,
      left: 150,
      right: 80,
      backgroundColor: 'rgba(30, 30, 30, 0.5)',
      borderColor: 'rgba(80, 80, 80, 0.3)'
    },
    xAxis: {
      max: 'dataMax',
      name: '销量(件)',
      nameTextStyle: {
        color: '#a0a0a0'
      },
      axisLabel: {
        color: '#a0a0a0',
        formatter: '{value}'
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(80, 80, 80, 0.5)',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      max: 5,
      axisLabel: {
        show: true,
        fontSize: 14,
        color: '#a0a0a0'
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        realtimeSort: true,
        name: '销量',
        type: 'bar',
        data: generateData(months[currentMonthIndex]),
        itemStyle: {
          color: function (params) {
            return productColors[params.data.product] || '#5470c6';
          },
          borderRadius: [0, 4, 4, 0],
          borderColor: '#1a1a1a',
          borderWidth: 1
        },
        encode: {
          x: 'value',
          y: 'product'
        },
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
          color: '#fff',
          formatter: '{@value}件'
        },
        barWidth: '60%'
      }
    ],
    animationDuration: 1000,
    animationDurationUpdate: 2000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    graphic: {
      elements: [
        {
          type: 'text',
          right: 160,
          bottom: 60,
          style: {
            text: months[currentMonthIndex],
            font: 'bolder 60px monospace',
            fill: 'rgba(80, 80, 80, 0.2)'
          },
          z: 100
        }
      ]
    }
  };

  myChart.setOption(option);

  const interval = setInterval(() => {
    currentMonthIndex = (currentMonthIndex + 1) % months.length;
    option.graphic.elements[0].style.text = months[currentMonthIndex];
    option.series[0].data = generateData(months[currentMonthIndex]);
    myChart.setOption(option);
  }, 2000);

  window.addEventListener('resize', () => myChart.resize());
  return () => clearInterval(interval);
};
</script>
<style lang="scss" scoped>
.MerchantData {
  width: 100%;
  height: 100vh;
  /* 使用视口高度确保有明确高度 */
  padding: 20px;
  box-sizing: border-box;
  background-color: #121212;
  overflow: hidden;
  /* 防止整体溢出 */

  .el-row {
    height: 100%;
    margin: 0 !important;
    /* 清除可能的边距 */

    .el-col {
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      /* 确保padding不增加总高度 */

      &.header {
        height: auto;
        margin-bottom: 20px;
        flex-shrink: 0;
        /* 防止头部被压缩 */

        .header-content {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 20px;
          background: linear-gradient(90deg, #1a1a1a 0%, #222 100%);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(80, 80, 80, 0.3);

          h2 {
            margin: 0;
            color: #e0e0e0;
            font-size: 18px;
            font-weight: 500;
          }
        }
      }

      .chart-container {
        height: calc(100% - 20px);
        /* 减去可能的间距 */
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow: hidden;
        /* 防止内部内容溢出 */
      }

      >div {
        background: linear-gradient(145deg, #1e1e1e, #1a1a1a);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(80, 80, 80, 0.3);
        padding: 15px;
        box-sizing: border-box;
        /* 重要 */
        height: 100%;
        /* 确保填充父容器 */
        overflow: hidden;
        /* 防止图表溢出 */
      }
    }
  }

  .Incomechart,
  .Piechart,
  .Barchart {
    width: 100%;
    height: 100%;
    min-height: 0;
  
  }

  .Incomechart {
    flex: 1 1 60%;
    /* 使用flex分配空间 */
  }

  .Piechart {
    flex: 1 1 40%;
    /* 使用flex分配空间 */
  }
}
</style>
