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
          user_id: {
            name: "user_id",
            label: "用户",
            select_klass_name: "User"
          }
        },
        filters: {
          dimension: "user",
          date_start: dayjs().startOf('week').format("YYYY-MM-DD"),
          date_end: dayjs().endOf('week').format("YYYY-MM-DD"),
          user_id: null
        },
        canvasId: "opportunityAmountUser",
        data: {},
        tableHead: [],
        tableColumns: [],
        tableData: [],
        amountCustomField: {},
        receivedAmountCustomField: {},
        unReceivedAmountCustomField: {},
        uChart: null,
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      }
    },
    async onLoad() {
      let { featureLabels } = this;

      uni.setNavigationBarTitle({
        title: `${featureLabels['opportunity']}金额按用户排名`
      })

      // 初始化页面数据
      this.fetchData();
    },
    methods: {
      async onPullDownRefresh() {
        this.filters = {
          dimension: "user",
          date_start: dayjs().startOf('week').format("YYYY-MM-DD"),
          date_end: dayjs().endOf('week').format("YYYY-MM-DD"),
        };
        await this.fetchData();

        uni.stopPullDownRefresh();
      },
      fetchData(){
        let { filters } = this;

        reportCenterApi.opportunity_amount(filters).then((res) => {
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
              amount: data.data.y[index],
              department: data.data.department[index]
            }
          })
          this.tableHead = ["用户", "部门", "金额"];
          this.tableColumns = ["x", "department", "amount"];
          this.tableData = tableData;

          let chartData ={series:[], categories: []};

          chartData.categories = data.data?.x;
          chartData.series = [
            {
              name: "金额",
              data: data.data.y
            }
          ];

          this.showChart(chartData);
        })
      },
      showChart(chartData){
        let pixelRatio  = 1;

        this.uChart = new uCharts({
          $this: this,
          canvasId: this.canvasId,
          type: 'column',
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
            data:[
              {
                calibration: true,
                position: 'left',
                title: '金额',
                titleFontSize: 12,
                // format:(val)=>{return val.toFixed(0)+'元'}
              }
            ],
            showTitle:true,
            gridType:'dash',
            dashLength:4,
            splitNumber:5
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
</style>
