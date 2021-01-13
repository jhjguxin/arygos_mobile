<template>
  <view class="list">
    <u-grid :col="4" :border="false">
      <u-grid-item>
        <u-button size='mini' type="primary" @click="handleReadAllClick">阅读全部</u-button>
      </u-grid-item>
      <u-grid-item>
        <u-button size='mini' type="warning" @click="handleDestroyAllClick">清空消息</u-button>
      </u-grid-item>
    </u-grid>
    <u-gap></u-gap>
    <uni-list
      v-for="item in list"
      v-bind:key="item.id"
     >
      <!-- 显示圆形头像 -->
      <uni-list-item
        :disabled="item.status == 'read'"
        :title="item.title" :note="item.body"
        :rightText="item.time"
        :clickable="item.status != 'read'"
        @click="handleItemClick($event, item.id)"
      ></uni-list-item>
    </uni-list>
    <uni-load-more v-if="list.length > 0" :status="status" />
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { notificationApi } from 'services/http';
  
  export default {
    components: {},
    data() {
      return {
        list: [], // 列表数据
        status: 'more', // 加载状态
        tipShow: false, // 是否显示顶部提示框
        pageSize: 20, // 每页显示的数据条数
        page: 1 // 当前页数
      };
    },
    onLoad() {
      // 初始化页面数据
      this.fetchNotification({reload: true });
    },
    methods: {
      /**
       * 下拉刷新回调函数
       */
      onPullDownRefresh() {
        this.page = 1;
        this.fetchNotification({ reload: true });
      },
      /**
       * 上拉加载回调函数
       */
      onReachBottom() {
        let { page } = this;
        page += 1;
        this.page = page;
        this.fetchNotification({ page });
      },
      /**
       * 获取页面数据
       * @param {Object} reload 参数reload值为true时执行列表初始化逻辑，值为false时执行追加下一页数据的逻辑。默认为false
       */
      fetchNotification({ reload = false, page = 1}) {
        this.status = 'loading';
        let { pageSize: per_page, list } = this;
        if (reload) {
          page = 1;
          list = [];
        };
        
        notificationApi.index({ page, per_page }).then((res) => {
          let {
            data: {
              data: {
                next_page, models: _models
              }
            },
          } = res;

          const tempList = _.map(_models, (model) => (
            {
              ...model,
              time: dayjs(model.created_at).format("MM-DD HH:ss")
            }
          ));
          if (next_page) {
            this.status = 'more';
          } else {
            this.status = 'noMore';
          }

          if (reload) {
            // 停止刷新
            uni.stopPullDownRefresh();
          }

          this.list = list.concat(tempList);
        })

      },
      handleItemClick (event, id) {
        notificationApi.read({id}).then((res)=> {
          let {
            data: {
              code
            },
          } = res;
          let { list } = this;
          
          if (code == 0) {
            _.each(list, (model)=> {
              if (model.id == Number(id)) model.status = 'read';
            })
            this.$set(this, "list", list);
          }
        })
      },
      handleReadAllClick (event) {
        notificationApi.read_all().then((res)=> {
          let {
            data: {
              code
            },
          } = res;
          let { list } = this;
          
          if (code == 0) {
            _.each(list, (model)=> {
              model.status = 'read';
            })
            this.$set(this, "list", list);
          }
        })
      },
      handleDestroyAllClick (event) {
        notificationApi.destroy_all().then((res)=> {
          let {
            data: {
              code
            },
          } = res;
          
          if (code == 0) {
            this.$set(this, "list", []);
          }
        })
      },
    }
  };
</script>

<style>
</style>