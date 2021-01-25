<template>
  <view>
    <view>
      <u-card
        full
        :title="model.name"
        :sub-title="model.extra.job"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        v-if="model && customFieldsObject"
      >
        <view slot="body">
          <u-row gutter="16" v-if="customFieldsObject['extra.tel']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['extra.tel'].label}}</view>
            </u-col>
            <u-col span="9">
               <custom-field-on-show :customField="customFieldsObject['extra.tel']" :record="model" />
            </u-col>
          </u-row>
          <u-row gutter="16" v-if="customFieldsObject['extra.phone']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['extra.phone'].label}}</view>
            </u-col>
            <u-col span="9">
               <custom-field-on-show :customField="customFieldsObject['extra.phone']" :record="model" />
            </u-col>
          </u-row>
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
              <view>{{customFieldsObject['creator'].label}}</view>
            </u-col>
            <u-col span="9">
              <custom-field-on-show
              :customField="customFieldsObject['creator']" :record="model" inline
              />
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
        <sales-activity-list
          :params="salesActivityList.params"
          style="height: 680rpx;"
          ref="salesActivityList"
          v-if="salesActivityList.params"
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
    </view>
    <unauthorized v-if="isInvalidData"/>
    <permit-checker authKey="contact#show" ></permit-checker>
  </view>
</template>

<script>
  import _ from 'lodash';
  import { contactApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      let { query: {id} } = this.$route;

      return {
        id,
        klassName: "Contact",
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
            }
          ],
          current: 0
        },
        salesActivityList: {
          params: {
            contact_id: id
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
        editUrl: `/pages/contact/contactEdit/contactEdit?id=${id}`
      }
    },
    async onLoad() {
      let { klassName, id } = this;
      let customFields = await CustomField.instance().fetchData(klassName);
      let model = await this.fetchContactShow({ id });

      this.customFields = customFields;
      this.customFieldsObject = Object.assign({}, ...customFields.map(customField => ({[customField.name]: customField})));
      this.model= model;

      uni.setNavigationBarTitle({
        title: model.name || "联系人详情"
      });
    },
    methods: {
      async fetchContactShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await contactApi.show({id});
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
        contactApi.mass_destroy({ids: [id]}).then((res) => {
          let { data: {code, remark}} = res;

          if (code == 0) {
            uni.showToast({
              icon: 'success',
              title: '操作成功',
              duration: 1000
            });
            _.delay(()=> {
              uni.navigateTo({
                url: '/pages/contact/contactList/contactList'
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
