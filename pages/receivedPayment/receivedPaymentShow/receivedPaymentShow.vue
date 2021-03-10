<template>
  <view>
    <view>
      <u-card
        full
        :title="model.receiveDate"
        :sub-title="model.amount"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        v-if="model && customFieldsObject"
      >
        <view slot="body">
          <u-row gutter="16" v-if="customFieldsObject['received_payment_plan']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['received_payment_plan'].label}}</view>
            </u-col>
            <u-col span="9">
               <custom-field-on-show :customField="customFieldsObject['received_payment_plan']" :record="model" />
            </u-col>
          </u-row>
          <u-row gutter="16" v-if="customFieldsObject['broker_user']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['broker_user'].label}}</view>
            </u-col>
            <u-col span="9">
               <custom-field-on-show :customField="customFieldsObject['broker_user']" :record="model" />
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
    </view>
    <unauthorized v-if="isInvalidData"/>
    <permit-checker authKey="received_payment#show" ></permit-checker>
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { receivedPaymentApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      return {
        id: 0,
        klassName: "ReceivedPayment",
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
            }
          ],
          current: null
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
        editUrl: ""
      }
    },
    async onLoad(options) {
      let { id } = options;
      let { klassName } = this;
      let customFields = await CustomField.instance().fetchData(klassName);
      let model = await this.fetchReceivedPaymentShow({ id });

      this.id = id;
      this.editUrl = `/pages/receivedPayment/receivedPaymentEdit/receivedPaymentEdit?id=${id}`;

      this.customFields = customFields;
      this.customFieldsObject = Object.assign({}, ...customFields.map(customField => ({[customField.name]: customField})));
      this.model= model;
      this.tabs.current = 0;

      uni.setNavigationBarTitle({
        title: model.name || "回款记录详情"
      });
    },
    methods: {
      async fetchReceivedPaymentShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await receivedPaymentApi.show({id});
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
        receivedPaymentApi.mass_destroy({ids: [id]}).then((res) => {
          let { data: {code, remark}} = res;

          if (code == 0) {
            uni.showToast({
              icon: 'success',
              title: '操作成功',
              duration: 1000
            });
            _.delay(()=> {
              uni.navigateTo({
                url: '/pages/receivedPayment/receivedPaymentList/receivedPaymentList'
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
