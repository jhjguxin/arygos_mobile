<template>
  <view>
    <common></common>

    <uni-calendar
      :insert="uniCalendar.insert"
      :lunar="uniCalendar.lunar"
      :start-date="uniCalendar.startDate"
      :end-date="uniCalendar.endDate"
      :range="uniCalendar.range"
      :selected="uniCalendar.selected"
      @change="handleCalendarChange"
      @monthSwitch="handleMonthSwitch"
     ></uni-calendar>
     <u-divider half-width="40%">代办列表</u-divider>
     <u-swipe-action
       v-for="(item, index) in reminders"
       :key="item.id"
       v-bind:key="item.id"
       :show="item.swipeAction.show" :index="index"
       @click="handleSwipActionClick" @open="handleSwipeActionOpen"
       :options="item.swipeAction.options"
     >
       <u-cell-item
         :title="item.body"
         :title-style="item.uCellItem.titleStyle"
         :value="item.title"
         :value-style="item.uCellItem.valueStyle"
         :label="item.remindAt"
         :label-style="item.uCellItem.labelStyle"
         :arrow="item.uCellItem.arrow"
         @click="handleItemClick($event, item)"
       ></u-cell-item>
     </u-swipe-action>
     <u-empty class="u-p-t-80" mode="list" :text="uEmpty.text" v-if="reminders.length == 0"></u-empty>
     <uni-load-more
       :status="status" :contentText="loadText"
       font-size="24"
       @clickLoadMore="handleLoadMore"
       v-if="reminders.length > 0" />
      <u-popup
        v-model="uPopup.show"
        :mode="uPopup.mode"
        :closeable="uPopup.closeable"
        :width="uPopup.width"
        :height="uPopup.height"
        v-if="uPopup.event"
      >
        <u-card
          full
          title="任务详情"
          :margin="uPopup.card.margin"
          :padding="uPopup.card.padding"
          :show-foot="uPopup.card.showFoot"
          :border="uPopup.card.border"
        >
          <view slot="body">
            <u-row gutter="16" class="u-p-10">
              <u-col span="3" class="u-font-sm">开始时间</u-col>
              <u-col span="9">{{uPopup.event.remindAt}}</u-col>
            </u-row>
            <u-row gutter="16" class="u-p-10">
              <u-col span="3" class="u-font-sm">状态</u-col>
              <u-col span="9">
                <u-tag :text="uPopup.event.status_display" :type="uPopup.event.uTag.type"></u-tag>
              </u-col>
            </u-row>
            <u-row gutter="16" class="u-p-10">
              <u-col span="3" class="u-font-sm">重复</u-col>
              <u-col span="9">{{uPopup.event.repeat_display}}</u-col>
            </u-row>
            <u-row gutter="16" class="u-p-10">
              <u-col span="3" class="u-font-sm">提醒时间</u-col>
              <u-col span="9">{{uPopup.event.remind_type_display}}</u-col>
            </u-row>
            <u-row gutter="16" class="u-p-10">
              <u-col span="3" class="u-font-sm">关联对象</u-col>
              <u-col span="9">
                <text
                  v-if="uPopup.event.related_item_id" style="color: #2979ff;"
                  @tap.stop="handleRelatedItemClick($event, uPopup.event)"
                >
                  {{uPopup.event.related_item_display}}
                </text>
              </u-col>
            </u-row>
            <u-row gutter="16" class="u-p-10">
              <u-col span="3" class="u-font-sm">内容</u-col>
              <u-col span="9">{{uPopup.event.note}}</u-col>
            </u-row>
            <u-row gutter="16" class="u-p-10">
              <u-col span="3" class="u-font-sm">参与人</u-col>
              <u-col span="9">{{uPopup.event.userNames}}</u-col>
            </u-row>
          </view>
        </u-card>
      </u-popup>
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { eventApi, reminderApi } from 'services/http';
  import RedDot from 'services/red_dot';

  export default {
    data() {
      return {
        uniCalendar: {
          insert: true,
          lunar: true,
          range: false,
          startDate: null,
          endDate: null,
          selected: []
        },
        reminders: [],
        currentDate: dayjs().format("YYYY-MM-DD"),
        currentMonth: dayjs().format("YYYY-MM"),
        page: 1,
        perPage: 8, // 分页数
        uPopup: {
          show: false,
          event: null,
          mode: "center",
          closeable: false,
          width: "80%",
          height: "80%",
          card: {
            border: true,
            margin: "16",
            padding: 20,
            showFoot: false
          }
        },
        uEmpty: {
          text: "暂无代办事项"
        },
        loadText: {
          contentdown: '点击加载更多',
          contentrefresh: '加载中',
          contentnomore: '没有更多数据了'
        }
      }
    },
   onShow() {
    this.fetchListData({});
    this.fetchTodoDot();
    _.delay(()=> {
      this.resetRedDot();
    }, 1000)
   },
    methods: {
      formatItem({item}) {
        let titleStyle = {'font-size': '24rpx'};
        if (item.is_expired) {
          titleStyle = {
            ...titleStyle,
            color: "red"
          };
        };
        if (item.status == "completed") {
          titleStyle = {
            ...titleStyle,
            textDecoration: "line-through"
          };
        }

        let options = [
          {
            text: '完成',
            style: {
              backgroundColor: '#007aff'
            }
          }
        ];
        if (item.remindable_type == "Event") {
          options.push(
            {
              text: '删除',
              style: {
                backgroundColor: '#dd524d'
              }
            }
          );
        }

        return {
          ...item,
          body: _.truncate(item.body, {length: 80}),
          remindAt: `提醒时间: ${dayjs(item.remind_at).format("YYYY-MM-DD HH:mm")}`,
          createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
          uCellItem: {
            titleStyle,
            valueStyle: {'font-size': '24rpx'},
            labelStyle: {'font-size': '24rpx'},
            arrow: item.remindable_type == "Event"
          },
          swipeAction: {
            show: false,
            options
          }
        }
      },
      fetchListData({ page, reload }) {
        let { perPage: per_page, reminders = [], currentDate: date } = this;

        let params = {
          date, page, per_page
        };

        if (reload) {
          page = 1;
          reminders = [];
        }

        reminderApi.index(params).then((res)=> {
          let {
            data: {
              code, remark, data: {
                page, next_page, models: _reminders,
              }
            }
          } = res;

          _.delay(()=>{
            uni.hideLoading();
          }, 100);

          if (code == 0) {
            _reminders = _.map(_reminders, (item)=> {
              return this.formatItem({item})
            });

            reminders = (page == 1) ? _reminders : _.concat(reminders, _reminders);
            reminders = _.orderBy(reminders, ['remind_at'], ['asc']);

            this.page = page;
            this.isLoading = false;
            this.status = _.isNumber(next_page) ? 'more' : 'noMore';
            this.reminders = reminders;
          } else {
            _.delay(()=>{
              uni.showToast({
                icon: 'none',
                title: remark || "获取数据失败",
                duration: 1000
              });
            }, 200);

            return null;
          }
        });
      },
      fetchTodoDot () {
        let { currentMonth } = this;
        let date = dayjs(currentMonth);

        let dates = _.range(1, date.daysInMonth() + 1).map((day)=> {
          let _date = date.clone().date(day);
          return _date.format("YYYY-MM-DD")
        });

        let params = {
          dates
        };

        reminderApi.todo_dot(params).then((res)=> {
          let {
            data: {
              code, remark, data: {
                dates
              }
            }
          } = res;
          this.uniCalendar.selected = _.map(dates, (item)=> {
            return {
              date: item[0],
              // info: "待办",
              data: {
                count: item[1]
              }
            }
          })
        })
      },
      handleReminderComplate({reminder}) {
        let { id } =  reminder;
        reminderApi.complate({id}).then((res)=> {
          let {
            data: {
              code, remark, data: item
            }
          } = res;

          if (code == 0) {
            let { reminders } = this;
            let index = _.findIndex(reminders, (item)=> item.id == id);

            reminders[index] = this.formatItem({ item });

            this.reminders = _.cloneDeep(reminders);

            this.fetchTodoDot();
          }
        })
      },
      handleEventComplate({reminder}) {
        let { remindable_id, id } =  reminder;
        eventApi.complate({id: remindable_id}).then((res)=> {
          let {
            data: {
              code, remark, data: item
            }
          } = res;
          if (code == 0) {
            let { reminders } = this;
            let index = _.findIndex(reminders, (item)=> item.id == id);

            reminder = {
              ...reminder,
              status: "completed",
              is_expired: false
            };

            reminders[index] = this.formatItem({ item: reminder });
            this.reminders = _.cloneDeep(reminders);

            this.fetchTodoDot();
          }
        })
      },
      handleEventDestroy({reminder}) {
        let { remindable_id, id } =  reminder;
        eventApi.destroy({id: remindable_id}).then((res)=> {
          let {
            data: {
              code, remark, data: item
            }
          } = res;
          if (code == 0) {
            let { reminders } = this;
            let index = _.findIndex(reminders, (item)=> item.id == id);

            reminders.splice(index, 1);
            this.reminders = _.cloneDeep(reminders);
            uni.showToast({
              icon: 'success',
              title: '操作成功',
              duration: 1000
            });

            this.fetchTodoDot();
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "操作失败",
              duration: 1000
            })
          }
        })
      },
      handleCalendarChange (value) {
        let { fulldate: date } = value;
        this.currentDate = date;

        _.delay(()=> {
          this.fetchListData({preload: true});
        }, 50);
      },
      handleMonthSwitch (value) {
        let { month, year } = value;
        this.currentMonth = `${year}-${month}`;

        _.delay(()=> {
          this.fetchTodoDot();
        }, 50);
      },
      handleLoadMore () {
        let { page, status } = this;
        if (status == "noMore") return;

        page += 1;
        this.fetchListData({page});
      },
      handleSwipeActionOpen (index) {
        let { reminders } = this;
        reminders = _.each(reminders, (item) => {
          item.swipeAction.show = false;
        });
        reminders[index].swipeAction.show = true;

        this.reminders = reminders;
      },
      handleSwipActionClick (index, option_index) {
        if (option_index === 0) {
          let { reminders } = this;
          let reminder = reminders[index];

          if (reminder.status == "todo") {
            if (reminder.remindable_type == "Event") {
              this.handleEventComplate({ reminder });
            } else {
              this.handleReminderComplate({ reminder });
            }
            // REVIEW 重置小红点
            _.delay(()=> {
              this.resetRedDot();
            }, 1000)
          }
          reminder.swipeAction = {show: false};

          this.reminders = reminders;
        }
        if (option_index === 1) {
          let { reminders } = this;
          let reminder = reminders[index];

          if (reminder.remindable_type == "Event") {
            this.handleEventDestroy({ reminder });
          }
          // REVIEW 重置小红点
          _.delay(()=> {
            this.resetRedDot();
          }, 1000)
        }
      },
      resetRedDot() {
        let { currentDate, uniCalendar: { selected } } = this;
        if (currentDate == dayjs().format("YYYY-MM-DD")) {
          RedDot.instance().removeTodoDot();
          let item = _.find(selected, (item)=> (item.date == currentDate));
          let count = item?.data?.count || 0;

          if (count > 0) {
            uni.setTabBarBadge({
              index: 1,
              text: String(count)
            });
          }
        }
      },
      handleItemClick (e, item) {
        let { uPopup } = this;

        if (item.remindable_type == "Event") {
          eventApi.show({id: item.remindable_id }).then((res)=> {
            let {
              data: {
                code, remark, data: event
              }
            } = res;
            let type = "success";
            if (event.status == "in_progress") {
              type = event.is_expired ? "error" : "primary"
            }

            event = {
              ...event,
              uTag: {
                type
              },
              remindAt: dayjs(event.remind_at).format("YYYY-MM-DD HH:mm"),
              userNames: _.map(event.users, "name").join(", ")
            };

            if (code == 0) {
              this.uPopup = {
                ...uPopup,
                event,
                show: true
              };
            };
          });
        }
      },
      handleRelatedItemClick(e, event) {
        e.stopPropagation();
        let {related_item_id: id } = event;

        const urlMap = {
          Lead: `/pages/lead/leadShow/leadShow?id=${id}`,
          Customer: `/pages/customer/customerShow/customerShow?id=${id}`,
          Contact: `/pages/contact/contactShow/contactShow?id=${id}`,
          Opportunity: `/pages/opportunity/opportunityShow/opportunityShow?id=${id}`,
          Contract: `/pages/contract/contractShow/contractShow?id=${id}`,
        }
        let url = urlMap[event.related_item_type];

        uni.navigateTo({
          url
        })
      }
    }
  }
</script>

<style>

</style>
