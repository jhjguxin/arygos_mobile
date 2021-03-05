<template>
  <view>
    <report-filter
      :filterColumns="filterColumns" :filters="filters"
      @filterConfirm="handleFilterConfirm"
    />
    <view class="qiun-charts" >
      <canvas :canvas-id="canvasId" :id="canvasId" class="charts" @touchstart="touchFunnel"></canvas>
    </view>
    <view class="table-container u-p-26">
      <u-table class="table">
        <u-tr>
          <u-th v-for="(item, index) in tableHead"  :key="index">{{item}}</u-th>
        </u-tr>
        <u-tr v-for="(item, index) in tableData" :key="index">
          <u-td>{{item.x}}</u-td>
          <u-td>{{item.count}}</u-td>
          <u-td>{{item.amount}}</u-td>
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
          date_start: dayjs().startOf('week').format("YYYY-MM-DD"),
          date_end: dayjs().endOf('week').format("YYYY-MM-DD"),
          department_id: null,
          user_id: null
        },
        canvasId: "salesFunnel",
        data: {},
        tableHead: [],
        tableData: [],
        stageCustomField: {},
        uChart: null,
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      }
    },
    async onLoad() {
      let { klassName, featureLabels } = this;
      let customFields = await CustomField.instance().fetchData("Opportunity");

      this.stageCustomField = _.find(customFields, (customField) => customField.name == "stage");

      // 初始化页面数据
      this.fetchData();
    },
    methods: {
      async onPullDownRefresh() {
        this.filters = {
          date_start: dayjs().startOf('week').format("YYYY-MM-DD"),
          date_end: dayjs().endOf('week').format("YYYY-MM-DD"),
        };
        await this.fetchData();

        uni.stopPullDownRefresh();
      },
      fetchData(){
        let { filters } = this;

        reportCenterApi.sales_funnel(filters).then((res) => {
          let {
            data: {
              data
            },
          } = res;

          this.data = data;
          let tableData = [];
          _.each(data.data.x, (_item, index) => {
            let column = tableData[index] || {};
            tableData[index] = {
              ...column,
              x: _item,
              key: index,
              amount: data.data.amount[index],
              possibility_amount: data.data.possibility_amount[index],
              count: data.data.count[index],
            }
          });
          this.tableHead = [
            this.stageCustomField.label, "数量", "金额"
          ];
          this.tableData = tableData;

          let chartData ={series:[]};

          chartData.series = _.map(data.data.x, (item, index) => {
            return {
              name: item,
              data: data.data.amount[index]
            }
          });

          this.showFunnel(chartData);
        })
      },
      showFunnel(chartData){
        let pixelRatio  = 1;
        this.uChart = new uCharts({
          $this: this,
          canvasId: this.canvasId,
          type: 'funnel',
          fontSize: 11,
          padding: [15,15,0,15],
          legend:{
            show:true,
            padding:5,
            lineHeight:11,
            margin:0,
          },
          background:'#FFFFFF',
          pixelRatio: pixelRatio,
          series: chartData.series,
          animation: true,
          width: uni.upx2px(750) *  pixelRatio,
          height: uni.upx2px(500) *  pixelRatio,
          dataLabel: true,
          extra: {
            funnel: {
              border:true,
              borderWidth:2,
              borderColor:'#FFFFFF'
            }
          },
        });
      },
      touchFunnel(e){
        this.uChart.showToolTip(e, {
          format: function (item) {
            return item.name + ':' + item.data
          }
        });
        this.uChart.touchLegend(e,{animation:true});
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
</style>