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
      let  featureLabels = getApp().globalData.featureLabels;

      return {
        filterColumns: {
          timeRange: {
            label: "时间",
            start: "date_start",
            end: "date_end",
          },
          product_category_id: {
            name: "product_category_id",
            label: featureLabels["product_category"],
            select_klass_name: "ProductCategory"
          },
          product_id: {
            name: "product_id",
            label: featureLabels["product"]
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
          dimension: "product",
          product_category_id: null,
          product_id: null,
          department_id: null,
          user_id: null
        },
        canvasId: "productSalesProduct",
        data: {},
        tableHead: [],
        tableColumns: [],
        tableData: [],
        uChart: null,
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      }
    },
    async onLoad() {
      let { featureLabels } = this;

      uni.setNavigationBarTitle({
        title: `${featureLabels['product']}销售按${featureLabels['product']}汇总`
      })

      // 初始化页面数据
      this.fetchData();
    },
    methods: {
      async onPullDownRefresh() {
        this.filters = {
          dimension: "product"
        };
        await this.fetchData();

        uni.stopPullDownRefresh();
      },
      fetchData(){
        let { filters, featureLabels } = this;

        reportCenterApi.product_sales(filters).then((res) => {
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
              product_category: data.data.product[index]?.product_category_name,
              quantity: data.data.quantity[index],
              average_price: data.data.average_price[index]
            }
          })
          this.tableHead = [featureLabels["product"], featureLabels["product_category"], "销量", "数量", "均价"];
          this.tableColumns = ["x", "product_category", "amount", "quantity", "average_price"];
          this.tableData = tableData;

          let chartData ={series:[], categories: []};

          chartData.categories = data.data?.x;
          chartData.series = [
            {
              name: "销量",
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
            itemCount: 3,
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
    width: 60vh;
    overflow-x: scroll;
  }
  .table-container .table {
    width: 75vh;
  }
</style>
