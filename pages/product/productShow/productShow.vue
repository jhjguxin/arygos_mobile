<template>
  <view>
    <view>
      <u-card
        full
        :title="model.name"
        :sub-title="model.statusDisplay"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        v-if="model && customFieldsObject"
      >
        <view class="" slot="body">
          <u-row gutter="16" justify="center">
            <u-col span="11">
              <u-swiper
                :list="model.uSwiper.list"
                :img-mode="model.uSwiper.imgMode"
                v-if="model.uSwiper"
              ></u-swiper>
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
                @success="$refs.attachmentList.fetchListData({})"
                :params="attachmentNew.params"
              />
            </view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>
    <unauthorized v-if="isInvalidData"/>
  </view>
</template>

<script>
  import _ from 'lodash';
  import { productApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      let { query: {id} } = this.$route;

      return {
        id,
        klassName: "Product",
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
              name: '附件'
            }
          ],
          current: null
        },
        attachmentList: {
          params: {
            attachmentable_type: "Product",
            attachmentable_id: id
          }
        },
        attachmentNew: {
          params: {
            attachmentable_type: "Product",
            attachmentable_id: id
          }
        },
        salesActionSheet: {
          list: [
            {
              text: "启用",
              disabled: true
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
        editUrl: `/pages/product/productEdit/productEdit?id=${id}`
      }
    },
    async onLoad() {
      let { klassName, id } = this;
      let customFields = await CustomField.instance().fetchData(klassName);
      let model = await this.fetchProductShow({ id });

      this.customFields = customFields;
      this.customFieldsObject = Object.assign({}, ...customFields.map(customField => ({[customField.name]: customField})));
      this.model= model;
      this.tabs.current = 0;

      let { salesActionSheet: { list } } = this;
      list[0] = {
        text: model.status == "enable" ? "禁用" : "启用"
      }
      this.salesActionSheet.list = list;

      uni.setNavigationBarTitle({
        title: model.name || "产品详情"
      });
    },
    methods: {
      async fetchProductShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await productApi.show({id});
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        _.delay(()=>{
          uni.hideLoading();
        }, 100);

        if (code == 0) {
          let { image_attachments = [] } = model;
          if (_.isEmpty(image_attachments)) {
            image_attachments = [{file_url: "/static/img/thumb.png"}];
          }

          model = {
            ...model,
            statusDisplay: model.status_display,
            uSwiper: {
              list: _.map(image_attachments, (item)=> (
                {image: item.file_url}
              )),
              imgMode: "aspectFit"
            }
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
        productApi.mass_destroy({ids: [id]}).then((res) => {
          let { data: {code, remark}} = res;

          if (code == 0) {
            uni.showToast({
              icon: 'success',
              title: '操作成功',
              duration: 1000
            });
            _.delay(()=> {
              uni.navigateTo({
                url: '/pages/product/productList/productList'
              });
            }, 1000);
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            })
          }
        })
      },
      doUpdateStatus ({id, status}) {
        let product = {
          id, status
        };
        productApi.update({id, product}).then((res) => {
          let { data: {
              code, remark, data: {
                status, status_display
              },
            },
          } = res;
          let { model } = this;

          if (code == 0) {
            uni.showToast({
              icon: 'success',
              title: '操作成功',
              duration: 1000
            });
            model = {
              ...model,
              status, status_display,
              statusDisplay: status_display
            }
            this.model = model;

            let { salesActionSheet: { list } } = this;
            list[0] = {
              text: model.status == "enable" ? "禁用" : "启用"
            }
            this.salesActionSheet.list = list;
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
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
          let { id, model: { status } } = this;
          status = (status == "enable") ? "disable" : "enable";
          this.doUpdateStatus({
            id,
            status
          })
        }
        if (index == 1) {
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
        if (index == 2) {
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
