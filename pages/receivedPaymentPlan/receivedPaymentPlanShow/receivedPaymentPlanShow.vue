<template>
  <view>
    <view>
      <u-card
        full
        :title="model.receive_stage_display"
        :sub-title="model.receiveDate"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        v-if="model && customFieldsObject"
      >
        <view slot="body">
          <u-row gutter="16" v-if="customFieldsObject['amount']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['amount'].label}}</view>
            </u-col>
            <u-col span="9">
               <custom-field-on-show :customField="customFieldsObject['amount']" :record="model" />
            </u-col>
          </u-row>
          <u-row gutter="16" v-if="customFieldsObject['status']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['status'].label}}</view>
            </u-col>
            <u-col span="9">
              <custom-field-on-show :customField="customFieldsObject['status']" :record="model" />
            </u-col>
          </u-row>
          <u-row gutter="16" v-if="customFieldsObject['contract']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['contract'].label}}</view>
            </u-col>
            <u-col span="9">
               <custom-field-on-show :customField="customFieldsObject['contract']" :record="model" />
            </u-col>
          </u-row>
          <u-row gutter="16">
          </u-row>
        </view>
      </u-card>
      <u-tabs-swiper
        ref="tabs" :list="tabs.list" :current="tabs.current" :is-scroll="false"
        @change="handleTabsSwiperChange"
      ></u-tabs-swiper>
      <view v-if="tabs.current == 0" class="u-padding-bottom-80">
        <entity-base-info
          :model="model" :klassName="klassName"
        />

          <u-grid :col="3"  :border="true" class="fixed-bottom">
            <u-grid-item @click="handleItemClick($event, editUrl)">
              <view class="grid-text">编辑</view>
            </u-grid-item>
            <u-grid-item index="_">
              &
            </u-grid-item>
            <u-grid-item @click="salesActionSheet.show = true">
              <view class="grid-text">更多</view>
              <u-action-sheet
                :list="salesActionSheet.list" v-model="salesActionSheet.show"
                @click="handleSalesActionSheetClick"
              ></u-action-sheet>
            </u-grid-item>
          </u-grid>
        </u-grid>
      </view>
      <view v-if="tabs.current == 1" class="u-padding-bottom-80">
        <received-payment-list-on-received-payment-plan-show
          ref="receivedPaymentList"
          :model="model" :klassName="klassName"
          :params="receivedPaymentList.params"
        />

        <u-grid :col="1"  :border="true" class="fixed-bottom">
          <u-grid-item @click="handleItemClick($event, receivedPaymentNew.url)">
            <view class="grid-text">新增</view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>
    <unauthorized v-if="isInvalidData"/>
    <permit-checker authKey="received_payment_plan#crud" ></permit-checker>
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { receivedPaymentPlanApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      let { query: {id} } = this.$route;
      let featureLabels = getApp().globalData.featureLabels;

      return {
        id,
        klassName: "receivedPaymentPlan",
        isInvalidData: false,
        model: {},
        customFields: [],
        customFieldsObject: null,
        card: {
          margin: "0 20rpx",
          padding: 30,
          showFoot: false
        },
        tabs: {
          list: [
            {
              name: '详情'
            },
            {
              name: `${featureLabels.received_payment}`
            }
          ],
          current: null
        },
        receivedPaymentNew: {
          url: `/pages/receivedPayment/receivedPaymentNew/receivedPaymentNew?contract_id=${id}`
        },
        receivedPaymentList: {
          params: {
            id
          }
        },
        salesActionSheet: {
          list: [
            {
              text: '删除',
              color: 'red',
              subText: '删除后不可恢复'
            },
            {
              text: '返回工作台'
            }
          ],
          show: false
        },
        featureLabels: getApp().globalData.featureLabels,
        editUrl: `/pages/receivedPaymentPlan/receivedPaymentPlanEdit/receivedPaymentPlanEdit?id=${id}`
      }
    },
    async onLoad() {
      let { klassName, id } = this;
      let customFields = await CustomField.instance().fetchData(klassName);
      let model = await this.fetchreceivedPaymentPlanShow({ id });

      this.customFields = customFields;
      this.customFieldsObject = Object.assign({}, ...customFields.map(customField => ({[customField.name]: customField})));
      this.model= model;
      this.tabs.current = 0;

      uni.setNavigationBarTitle({
        title: model.receive_stage_display || "回款计划详情"
      });
    },
    methods: {
      async fetchreceivedPaymentPlanShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await receivedPaymentPlanApi.show({id});
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        _.delay(()=>{
          uni.hideLoading();
        }, 100);

        if (code == 0) {
          model = {
            ...model,
            receiveDate: dayjs(model.receive_date).format("YYYY-MM-DD"),
            invoiceTypeDisplay: model.invoice_type_display,
          }

          return model;
        } else {
          _.delay(()=>{
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            });
          }, 200);
          this.isInvalidData = true;

          return null;
        }
      },
      doDestroy ({id}) {
        receivedPaymentPlanApi.mass_destroy({ids: [id]}).then((res) => {
          let { data: {code, remark}} = res;

          if (code == 0) {
            uni.showToast({
              icon: 'success',
              title: '操作成功',
              duration: 1000
            });
            _.delay(()=> {
              uni.navigateTo({
                url: '/pages/receivedPaymentPlan/receivedPaymentPlanList/receivedPaymentPlanList'
              });
            }, 1000);
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "操作失败",
              duration: 1000
            })
          }
        })
      },
      handleTabsSwiperChange (value) {
        this.tabs.current = value;
      },
      handleItemClick (event, url) {
        uni.navigateTo({
          url
        });
      },
      handleSalesActionSheetClick (index) {
        if (index == 0) {
          let { id, klassName, featureLabels } = this;
          uni.showModal({
            title: `确定删除${featureLabels[_.snakeCase(klassName)]}？`,
            content: '该操作成功后，将无法恢复。',
            success: (res) => {
              if (res.confirm) {
                this.doDestroy({id});
                return;
              }
              if (res.cancel) {
                return;
              }
            }
          });
        }
        if (index == 1) {
          let { editUrl } = this;
          uni.switchTab({
            url: '/pages/workbench/workbench',
          });
          return;
        }
      }
    }
  }
</script>

<style>
  .fixed-bottom {
    position: fixed;
    right: 0;
    bottom: calc( var(--window-bottom) + 0px);
    left: 0;
    z-index: 1030;
    margin-bottom: 6;
  }
</style>
