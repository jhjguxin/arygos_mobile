<template>
    <u-popup
      v-model:show="popup.show" :mode="popup.mode"
      :custom-style="{width: width}"
      @close="handlePopupClose"
    >
      <u-card
        title="评论"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
      >
        <template #body><view >
          <uni-list
            class="sales-activity-comment-list"
           >
            <u-swipe-action :autoClose="true">
              <u-swipe-action-item
                v-for="(item, index) in models"
                :key="item.id"
                v-model:show="item.swipeAction.show" :name="index"
                @click="handleSwipActionClick"
                :options="swipeAction.options"
              >
                <uni-list-item
                  :title="item.user.name" :note="item.content"
                >
                  <template #body><view class="uni-list-item__content">
                    <u-row>
                      <u-col span="4" class="u-padding-left-0 uni-list-item__content-title u-font-sm">{{ item.user.name }}</u-col>
                      <u-col span="8" text-align="right" class="u-font-xs">{{item.createdAt}}</u-col>
                    </u-row>
                    <text class="uni-list-item__content-note u-font-sm">{{ item.content }}</text>
                  </view></template>
                </uni-list-item>
              </u-swipe-action-item>
            </u-swipe-action>
            <u-loading-icon mode="circle" v-if="isLoading" />
          </uni-list>
          <u-form :model="form.model" ref="uForm" :error-type="form.errorType" class="u-padding-16">
            <u-form-item prop="content">
              <u-textarea v-model="form.model.content" placeholder="内容" border />
            </u-form-item>
          </u-form>
          <u-button type="primary" @click="handleSubmitClick">评论</u-button>
        </view></template>
      </u-card>
    </u-popup>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { salesActivityApi } from '@/services/http';

  export default {
  emits: ['close'],
  props: {
      sales_activity_id: { type: [String, Number] },
      width: { type: String, default: "90vw" }
  },

    data() {
      /* moved to props */

      return {
        models: [],
        popup: {
          show: false,
          mode: "right",
        },
        card: {
          margin: "0 0",
          padding: 30,
          showFoot: false
        },
        swipeAction: {
          options: [
            {
              text: '删除',
              style: {
                backgroundColor: '#dd524d'
              }
            }
          ]
        },
        form: {
          errorType: 'toast',
          rules: {
            content: [
              {
                min: 3,
                message: '内容不能少于3个字',
                trigger: 'change'
              },
              {
                required: true,
                message: '请输入内容',
                trigger: ['change','blur'],
              }
            ]
          },
          model: { content: "" }
        },
        isLoading: false,
      };
    },
    mounted () {
    },
    methods: {
      fetchListData () {
        /* moved to props */

        this.isLoading = true;
        salesActivityApi.comments({ id: this.sales_activity_id }).then((res)=> {
          let {
            data: {
              data: {
                models
              }
            },
          } = res;

          models = _.map(models, (item) => {
            return ({
              ...item,
              swipeAction: {show: false},
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm")
            })
          });
          models = _.orderBy(models, ['id'], ['desc']);

          this.isLoading = false;
          this.models = models;
        })
      },
      createComment() {
        /* moved to props */
        let { form: {model: { content }} } = this;

        let params = {
          sales_activity: { id: this.sales_activity_id },
          sales_activity_comment: { content }
        };
        salesActivityApi.comment(params).then((res)=> {
          let {
            data: {
              code, remark
            },
          } = res;

          if (code == 0) {
            this.fetchListData();
            this.$refs.uForm.resetFields();
            uni.showToast({
              icon: 'success',
              title: "评论成功",
              duration: 1000
            });
          } else {
            _.delay(()=>{
              uni.showToast({
                icon: 'none',
                title: remark || "操作失败",
                duration: 1000
              });
            }, 200);
          }
        })
      },
      doDestroy ({comment_id}) {
        /* moved to props */

        let params = {
          sales_activity: { id: this.sales_activity_id },
          comment_id
        };

        if (_.isNumber(this.sales_activity_id)) {
          salesActivityApi.destroy_comment(params).then((res) => {
            let { data: {code, remark}} = res;
            if (code == 0) {
              this.fetchListData();
             } else {
               _.delay(()=>{
                 uni.showToast({
                   icon: 'none',
                   title: remark || "操作失败",
                   duration: 1000
                 });
               }, 200);
             }
           })
        }
      },
      pop () {
        this.popup.show = true;
        this.fetchListData();

        // REVIEW 显示的时候才会渲染 form
        this.$nextTick(() => {
          this.$refs.uForm?.setRules(this.form.rules);
        });
      },
      handleSubmitClick () {
        this.$refs.uForm.validate().then(valid => {
          if (valid) {
            this.createComment();
          }
        });
      },
      handleSwipActionClick ({name, index}) {
        if (index === 0) {
          let { models } = this;
          let comment_id = models[name]?.id;
          this.doDestroy({comment_id})
        }
      },
      handlePopupClose () {
        const count = Array.isArray(this.models) ? this.models.length : 0;
        this.$emit("close", count)
      }
    }
  }
</script>

<style>
  .sales-activity-comment-list {
    min-height: 600rpx;
    max-height: 800rpx;
    overflow-y: scroll;
  }
  .uni-list-item__content {
    width: 100%;
  }
</style>
