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
          year: {
            name: "year",
            label: "年",
            collection_options: _.map(_.reverse(_.range(-6)), (num) => ( [
              String(dayjs().year() + num),
              String(dayjs().year() + num)
            ]))
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
          year: String(dayjs().year()),
          department_id: null,
          user_id: null
        },
        canvasId: "ownOpportunity",
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

      // 初始化页面数据
      this.fetchData();
    },
    methods: {
      async onPullDownRefresh() {
        this.filters = {
        };
        await this.fetchData();

        uni.setNavigationBarTitle({
          title: `赢单${featureLabels['opportunity']}汇总`
        })

        uni.stopPullDownRefresh();
      },
      fetchData(){
        let { filters } = this;

        reportCenterApi.won_opportunity(filters).then((res) => {
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
              count: data.data.count[index],
            }
          })
          this.tableHead = ["时间", "金额", "赢单数"];
          this.tableColumns = ["x", "amount", "count"];
          this.tableData = tableData;

          let chartData ={series:[], categories: []};

          chartData.categories = data.data?.x;
          chartData.series = [
            {
              name: "金额",
              data: data.data.amount,
              type: "column",
              index: 0
            },
            {
              name: "赢单数",
              data: data.data.count,
              type: "line",
              index: 1
            },
          ];

          this.showChart(chartData);
        })
      },
      showChart(chartData){
        let pixelRatio  = 1;

        this.uChart = new uCharts({
          $this: this,
          canvasId: this.canvasId,
          type: 'mix',
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
              },
              {
                calibration: true,
                position: 'right',
                title: '赢单数',
                titleFontSize: 12
              },
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
    width: 60vh;
    overflow-x: scroll;
  }
  .table-container .table {
    width: 75vh;
  }
</style>
