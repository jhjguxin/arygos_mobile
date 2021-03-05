<template>
  <view>
    <report-filter
      :filterColumns="filterColumns" :filters="filters"
      @filterConfirm="handleFilterConfirm"
    />
    <view class="qiun-charts" >
      <canvas
        :canvas-id="canvasId" :id="canvasId" class="charts"
        disable-scroll=true @touchstart="handleTouchstart" @touchmove="handleTouchmove" @touchend="handleTouchend"
      ></canvas>
    </view>
    <view class="table-container u-p-26">
      <u-table class="table">
        <u-tr>
          <u-th v-for="(item, index) in tableHead" :key="index">{{item}}</u-th>
        </u-tr>
        <u-tr v-for="(item, index) in tableData" :key="index">
          <u-td v-for="(key, index) in tableColumns" :key="index">{{item[key]}}</u-td>
        </u-tr>
      </u-table>
    </view>
  </view>
</template>


<script>
  import _ from "lodash";
  import dayjs from 'dayjs';
  import uCharts from '../../../js_sdk/u-charts/u-charts/u-charts.js';

  import { reportCenterApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      return {
        filterColumns: {
          timeRange: {
            label: "时间",
            start: "date_start",
            end: "date_end",
          },
          department_id: {
            name: "department_id",
            label: "部门",
            select_klass_name: "Department"
          },
          user_id: {
            name: "user_id",
            label: "用户",
            select_klass_name: "User"
          }
        },
        filters: {
          dimension: "creator",
          date_start: dayjs().startOf('week').format("YYYY-MM-DD"),
          date_end: dayjs().endOf('week').format("YYYY-MM-DD"),
          department_id: null,
          user_id: null
        },
        canvasId: "entityAddCreatedAt",
        data: {},
        tableHead: [],
        tableColumns: [],
        tableData: [],
        stageCustomField: {},
        uChart: null,
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      }
    },
    async onLoad() {
      let { featureLabels } = this;

      // 初始化页面数据
      this.fetchData();
    },
    methods: {
      async onPullDownRefresh() {
        this.filters = {
          dimension: "creator",
          date_start: dayjs().startOf('week').format("YYYY-MM-DD"),
          date_end: dayjs().endOf('week').format("YYYY-MM-DD"),
        };
        await this.fetchData();

        uni.stopPullDownRefresh();
      },
      fetchData(){
        let { filters } = this;

        reportCenterApi.entity_add(filters).then((res) => {
          let {
            data: {
              data
            },
          } = res;

          this.data = data;
          let tableData = [];
          _.each(data, (item) => {
            _.each(item.data.x, (_item, index) => {
              let column = tableData[index] || {};
              tableData[index] = {
                ...column,
                x: _item,
                key: index,
                [`${item.klass_name}`]: item.data.y[index],
              }
            })
          });
          this.tableHead = _.concat(["用户"] , _.map(this.data, "klass_label"));
          this.tableColumns = _.concat(["x"] , _.map(this.data, "klass_name"));
          this.tableData = tableData;

          let chartData ={series:[], categories: []};

          chartData.categories = data[0]?.data?.x;
          chartData.series = _.map(data, (item, index) => {
            return {
              name: item.klass_label,
              data: item.data.y
            }
          });

          this.showChart(chartData);
        })
      },
      showChart(chartData){
        let pixelRatio  = 1;

        this.uChart = new uCharts({
          $this: this,
          canvasId: this.canvasId,
          type: 'line',
          fontSize: 11,
          padding: [15,15,0,15],
          legend:{
            show:true,
            padding:5,
            lineHeight:11,
            margin:0,
          },
          dataLabel: true,
          dataPointShape: true,
          background:'#FFFFFF',
          pixelRatio: pixelRatio,
          categories: chartData.categories,
          series: chartData.series,
          animation: true,
          enableScroll: true,
          xAxis: {
            disableGrid: false,
            type: 'grid',
            gridType:'dash',
            itemCount: 4,
            scrollShow: true,
            scrollAlign: 'left'
          },
          yAxis: {
            gridType:'dash',
            gridColor:'#CCCCCC',
            dashLength: 8,
            min: 1,
          },
          width: uni.upx2px(750) *  pixelRatio,
          height: uni.upx2px(500) *  pixelRatio,
          extra: {
            line:{
              type: 'straight'
            }
          },
        });
      },
      handleTouchstart(e) {
        this.uChart.scrollStart(e);
      },
      handleTouchmove(e){
        this.uChart.scroll(e);
      },
      handleTouchend(e) {
        this.uChart.scrollEnd(e)
      },
      handleFilterConfirm(filters){
        this.filters =  filters;

        this.fetchData();
      }
    }
  }
</script>

<style>
  /*样式的width和height一定要与定义的cWidth和cHeight相对应*/
  .qiun-charts {
    width: 750upx;
    height: 500upx;
    background-color: #FFFFFF;
  }

  .charts {
    width: 750upx;
    height: 500upx;
    background-color: #FFFFFF;
  }
  .table-container {
    width: 53vh;
    overflow-x: scroll;
  }
  .table-container .table {
    width: 65vh;
  }
</style>
