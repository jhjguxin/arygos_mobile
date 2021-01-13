<template>
  <view class="attachment-list"  :style="style">
    <u-cell-group>
      <u-swipe-action
        v-for="(item, index) in models"
        :key="item.id"
        v-bind:key="item.id"
        :show="item.swipeAction.show" :index="index"
        @click="handleSwipActionClick" @open="handleSwipeActionOpen"
        :options="swipeAction.options"
      >
        <u-cell-item
          icon="file-text-fill"
          :title="item.file_file_name"
          :value="item.fileSize"
          @click="handleItemClick($event, item)"
        ></u-cell-item>
      </u-swipe-action>
    </u-cell-group>
    <u-empty class="u-p-t-80" mode="list" :text="uEmpty.text" v-if="models.length == 0"></u-empty>
    <uni-load-more
      :status="status" :contentText="loadText"
      @clickLoadMore="handleLoadMore"
      v-if="models.length > 0" />
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import prettyBytes from 'pretty-bytes';
  import mime from 'mime-types';
  import { attachmentApi } from 'services/http';

  export default {
    data() {
      let { style = "height: 55vh;"} = this.$attrs;

      return {
        style,
        models: [],
        status: 'more', // 加载状态
        page: 1,
        perPage: 8, // 分页数
        uEmpty: {
          text: "附件为空"
        },
        loadText: {
          contentdown: '点击加载更多',
          contentrefresh: '加载中',
          contentnomore: '没有更多数据了'
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
      };
    },
    mounted() {
      this.fetchListData({});
    },
    methods: {
      fetchListData ({ page, reload }) {
        let { params } = this.$attrs;
        let { perPage: per_page, models = [] } = this;

        if (reload) {
          page = 1;
          models = [];
        }
        
        params = {
          ...params,
          per_page,
          page
        };
        
        attachmentApi.index(params).then((res)=> {
          let {
            data: {
              data: {
                page, next_page, models: _models
              }
            },
          } = res;
        
          _models = _.map(_models, (item) => {
            return ({
              ...item,
              swipeAction: {
                show: false
              },
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD hh:mm"),
              fileSize: prettyBytes(item.file_file_size)
            })
          })
        
          _models = _.filter(
            _models, (item)=>
              _.findIndex(models, (_item)=> item.id == _item.id) == -1
          );
        
          models = (page == 1) ? _models : _.concat(models, _models);
        
          models = _.orderBy(models, ['id'], ['desc']);
        
          this.page = page;
          this.isLoading = false;
          this.status = _.isNumber(next_page) ? 'more' : 'noMore';
          this.models = models;
        })
      },
      doDestroy ({id}) {
        let { models } = this;
        if (_.isNumber(id)) {
          attachmentApi.destroy({ id }).then((res) => {
            let { data: {code, remark}} = res;
            let index = _.findIndex(models, (item)=> item.id == id);

            if (code == 0) {
              models.splice(index, 1);
              this.models = models;

              uni.showToast({
                icon: 'success',
                title: '操作成功',
                duration: 1000
              });
            } else {
              uni.showToast({
                icon: 'none',
                title: remark || "获取数据失败",
                duration: 1000
              })
            }
          })
        }
      },
      handleLoadMore () {
        let { page, status } = this;
        if (status == "noMore") return;

        page += 1;
        this.fetchListData({page});
      },
      handleItemClick (event, item) {
        let { file_url: filePath, file_content_type } = item;

        uni.showLoading({
            title: '文件下载中'
        });

        uni.downloadFile({
          url: encodeURI(filePath),
          success(res) {
            uni.hideLoading();
            
            let isImage = _.startsWith(file_content_type, "image/");
            const documentExts = [
              "doc", "xls", "ppt", "pdf", "docx", "xlsx", "pptx"
            ];
            let isDocument = _.includes(
              documentExts, mime.extension(file_content_type)
            );

            if (isImage) {
              uni.previewImage({
                urls: [res.tempFilePath]
              });
            } else if (isDocument){
              uni.openDocument({
                filePath: res.tempFilePath,
                fail(e) {
                  uni.hideLoading();
                  uni.showToast({
                    icon: 'none',
                    title: '文件打开失败！'
                  });
                }
              });
            } else {
              uni.saveFile({});
            }
          },
          fail() {
            uni.hideLoading();
            uni.showToast({
              icon: 'none',
              title: '附件下载出错！'
            });
          },
          complete() {
            uni.hideLoading();
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
          let id = models[index]?.id;
          this.doDestroy({id});
        }
      },
    }
  }
</script>

<style>
  .attachment-list {
    padding-left: 32rpx;
    overflow-y: scroll;
  }
</style>
