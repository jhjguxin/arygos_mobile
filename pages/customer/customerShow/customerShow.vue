<template>
  <view>
    <view>
      <u-card
        full
        :title="model.name"
        :sub-title="model.status_display"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        v-if="model && customFieldsObject"
      >
        <view slot="body">
          <u-row gutter="16" v-if="customFieldsObject['extra.detail_address']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['extra.detail_address'].label}}</view>
            </u-col>
            <u-col span="9">
               <custom-field-on-show :customField="customFieldsObject['extra.detail_address']" :record="model" />
            </u-col>
          </u-row>
          <u-row gutter="16">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['user'].label}}</view>
            </u-col>
            <u-col span="9">
              <custom-field-on-show
              :customField="customFieldsObject['user']" :record="model" inline
              /> & <custom-field-on-show
              :customField="customFieldsObject['department']" :record="model" inline
             />
            </u-col>
          </u-row>
          <u-row gutter="16">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['revisit_remind_at'].label}}</view>
            </u-col>
            <u-col span="9">
              <custom-field-on-show :customField="customFieldsObject['revisit_remind_at']" :record="model" />
            </u-col>
          </u-row>
        </view>
      </u-card>
      <u-tabs-swiper
        ref="tabs" :list="tabs.list" :current="tabs.current" :is-scroll="false"
        @change="handleTabsSwiperChange"
      ></u-tabs-swiper>
      <view v-if="tabs.current == 0" class="u-padding-bottom-80">
        <sales-activity-list
          :params="salesActivityList.params"
          style="height: 680rpx;"
          ref="salesActivityList"
          v-if="salesActivityList.params"
          />

        <u-grid :col="3"  :border="true" class="fixed-bottom">
          <u-grid-item @click="handleItemClick($event, revisitLogNew.url)">
            <view class="grid-text">写{{this.featureLabels['revisit_log']}}</view>
          </u-grid-item>
          <u-grid-item>
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
      </view>
      <view v-if="tabs.current == 1" class="u-padding-bottom-80">
        <entity-base-info
          :model="model" :klassName="klassName"
        />

        <u-grid :col="1"  :border="true" class="fixed-bottom">
          <u-grid-item @click="handleItemClick($event, editUrl)">
            <view class="grid-text">编辑</view>
          </u-grid-item>
        </u-grid>
      </view>
      <view v-if="tabs.current == 2" class="u-padding-bottom-80">
        <contact-list-on-customer-show
          ref="contactListOnCustomerShow"
          :model="model" :klassName="klassName"
          :params="contactListOnCustomerShow.params"
        />
      </view>
      <view v-if="tabs.current == 3" class="u-padding-bottom-80">
        <opportunity-list-on-customer-show
          ref="opportunityListOnCustomerShow"
          :model="model" :klassName="klassName"
          :params="opportunityListOnCustomerShow.params"
        />
      </view>
      <view v-if="tabs.current == 4" class="u-padding-bottom-80">
        <contract-list-on-customer-show
          ref="contractListOnCustomerShow"
          :model="model" :klassName="klassName"
          :params="contractListOnCustomerShow.params"
        />
      </view>
      <view v-if="tabs.current == 5" class="u-padding-bottom-80">
        <attachment-list
          ref="attachmentList"
          :model="model" :klassName="klassName"
          :params="attachmentList.params"
        />

        <u-grid :col="1"  :border="true" class="fixed-bottom">
          <u-grid-item @click="$refs.attachmentNew.showModal()">
            <view class="grid-text">
              <attachment-new
                ref="attachmentNew"
                @success="$refs.attachmentList.fetchListData({reload: true})"
                :params="attachmentNew.params"
              />
            </view>
          </u-grid-item>
        </u-grid>
      </view>
      <view v-if="tabs.current == 6" class="u-padding-bottom-80">
        <event-list
          ref="eventList"
          :model="model" :klassName="klassName"
          :params="eventList.params"
        />
        <u-grid :col="1"  :border="true" class="fixed-bottom">
          <u-grid-item @click="handleItemClick($event, eventNew.url)">
            <view class="grid-text">新增</view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>
    <unauthorized v-if="isInvalidData"/>
    <permit-checker authKey="customer#show" ></permit-checker>
  </view>
</template>

<script>
  import _ from 'lodash';
  import { customerApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      let featureLabels = getApp().globalData.featureLabels;

      return {
        id: 0,
        klassName: "Customer",
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
              name: '销售动态'
            },
            {
              name: '详情'
            },
            {
              name: featureLabels['contact'],
            },
            {
              name: featureLabels['opportunity'],
            },
            {
              name: featureLabels['contract'],
            },
            {
              name: '附件'
            },
            {
              name: '任务'
            }
          ],
          current: 0
        },
        salesActivityList: {},
        contactListOnCustomerShow: {},
        opportunityListOnCustomerShow: {},
        contractListOnCustomerShow: {},
        attachmentList: {},
        attachmentNew: {},
        eventList: {},
        eventNew: {},
        revisitLogNew: {},
        salesActionSheet: {
          list: [
            {
              text: '编辑',
            },
            {
              text: '转移给他人',
              subText: '感谢您的分享'
            },
            {
              text: '转入客户公海'
            },
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
        editUrl: "",
        transferUrl: "",
        transferIntoCommonUrl: ""
      }
    },
    async onLoad(options) {
      let { id } = options;
      let { klassName } = this;
      let customFields = await CustomField.instance().fetchData(klassName);
      let model = await this.fetchCustomerShow({ id });

      this.salesActivityList = {
        params: {
          customer_id: id
        }
      };
      this.contactListOnCustomerShow = {
        params: {
          id
        }
      };
      this.opportunityListOnCustomerShow = {
        params: {
          id
        }
      };
      this.contractListOnCustomerShow = {
        params: {
          id
        }
      };
      this.attachmentList = {
        params: {
          attachmentable_type: "Customer",
          attachmentable_id: id
        }
      };
      this.attachmentNew = {
        params: {
          attachmentable_type: "Customer",
          attachmentable_id: id
        }
      };
      this.eventList = {
        params: {
          related_item_type: "Customer",
          related_item_id: id
        }
      };
      this.eventNew = {
        url: `/pages/event/eventNew/eventNew?related_item_type=Customer&related_item_id=${id}`
      };
      this.revisitLogNew = {
        url: `/pages/revisitLog/revisitLogNew/revisitLogNew?loggable_type=Customer&loggable_id=${id}`
      };
      this.editUrl = `/pages/customer/customerEdit/customerEdit?id=${id}`;
      this.transferUrl = `/pages/common/transfer/transfer?ids=${id}&klassName=Customer`;
      this.transferIntoCommonUrl = `/pages/common/transferIntoCommon/transferIntoCommon?ids=${id}&klassName=CustomerCommon`;

      this.customFields = customFields;
      this.customFieldsObject = Object.assign({}, ...customFields.map(customField => ({[customField.name]: customField})));
      this.model= model;

      uni.setNavigationBarTitle({
        title: model.name || "客户详情"
      });
    },
    methods: {
      onBackPress() {
        // 拦截掉默认back, 使用 navigateTo 重载列表页
        uni.navigateTo({
          url: "/pages/customer/customerList/customerList"
        })
        return true;
      },
      async fetchCustomerShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await customerApi.show({id});
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        _.delay(()=>{
          uni.hideLoading();
        }, 100);

        if (code == 0) {
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
        customerApi.mass_destroy({ids: [id]}).then((res) => {
          let { data: {code, remark}} = res;

          if (code == 0) {
            uni.showToast({
              icon: 'success',
              title: '操作成功',
              duration: 1000
            });
            _.delay(()=> {
              uni.navigateTo({
                url: '/pages/customer/customerList/customerList'
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
          let { editUrl } = this;
          uni.navigateTo({
            url: editUrl
          });
          return;
        }
        if (index == 1) {
          let { transferUrl } = this;
          uni.navigateTo({
            url: transferUrl
          });
          return;
        }
        if (index == 2) {
          let { transferIntoCommonUrl } = this;
          uni.navigateTo({
            url: transferIntoCommonUrl
          });
          return;
        }
        if (index == 3) {
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
        if (index == 4) {
          uni.switchTab({
            url: '/pages/workbench/workbench'
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
