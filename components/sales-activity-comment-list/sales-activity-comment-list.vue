<template>
    <u-popup
      v-model="popup.show" :mode="popup.mode" :width="popup.width"
      @close="handlePopupClose"
    >
      <u-card
        title="评论"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
      >
        <view slot="body">
          <uni-list
            class="sales-activity-comment-list"
           >
            <u-swipe-action
              v-for="(item, index) in models"
              v-bind:key="item.id"
              :show="item.swipeAction.show" :index="index"
              @click="handleSwipActionClick" @open="handleSwipeActionOpen"
              :options="swipeAction.options"
            >
              <uni-list-item
                :title="item.user.name" :note="item.content"
              >
                <view slot="body"  class="uni-list-item__content">
                  <u-row>
                    <u-col span="4" class="u-padding-left-0 uni-list-item__content-title u-font-sm">{{ item.user.name }}</u-col>
                    <u-col span="8" text-align="right" class="u-font-xs">{{item.createdAt}}</u-col>
                  </u-row>
                  <text class="uni-list-item__content-note u-font-sm">{{ item.content }}</text>
                </view>
              </uni-list-item>
            </u-swipe-action>
            <u-loading mode="circle" v-if="isLoading"></u-loading>
          </uni-list>
          <u-form :model="form.model" ref="uForm" :error-type="form.errorType" class="u-padding-16">
            <u-form-item prop="content">
              <u-input
                v-model="form.model.content" type="textarea"
                placeholder="内容"
                border
              />
            </u-form-item>
          </u-form>
          <u-button type="primary" @click="handleSubmitClick">评论</u-button>
        </view>
      </u-card>
    </u-popup>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { salesActivityApi } from 'services/http';

  export default {
    data() {
      let { sales_activity_id, width = "85%" } = this.$attrs;

      return {
        sales_activity_id,
        models: [],
        popup: {
          show: false,
          mode: "right",
          width
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
          errorType: ['toast', 'border'],
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
          model: {}
        },
        isLoading: false,
      };
    },
    mounted () {
    },
    methods: {
      fetchListData () {
        let { sales_activity_id: id } = this.$attrs;

        this.isLoading = true;
        salesActivityApi.comments({ id }).then((res)=> {
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
        let { sales_activity_id: id } = this.$attrs;
        let { form: {model: { content }} } = this;

        let params = {
          sales_activity: {id},
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
        let { sales_activity_id: id } = this.$attrs;

        let params = {
          sales_activity: {id},
          comment_id
        };

        if (_.isNumber(id)) {
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
        _.delay(()=> {
          this.$refs.uForm.setRules(this.form.rules);
        }, 100)
      },
      handleSubmitClick () {
        this.$refs.uForm.validate(valid => {
          if (valid) {
            this.createComment();
          }
        });
      },
      handleSwipeActionOpen (index) {
        let { models } = this;
        models = _.each(models, (item) => {
          item.swipeAction.show = false;
        });
        models[index].swipeAction.show = true;

        this.models = models;
      },
      handleSwipActionClick (index, option_index) {
        if (option_index === 0) {
          let { models } = this;
          let comment_id = models[index]?.id;
          this.doDestroy({comment_id})
        }
      },
      handlePopupClose () {
        let { models = [] } = this;
        this.$emit("close", models.length)
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
