<template>
  <view >
    <common></common>
    <uni-list>
      <uni-list-item
        :show-extra-icon="true" :extra-icon="settingIcon" title="设置"
         link to="/pages/setting/setting"
      ></uni-list-item>
      <uni-list-item
        :show-extra-icon="true" :extra-icon="messageIcon" title="消息中心"
        :show-badge="newMessageCount >= 1" :badge-text="newMessageCount"
        showArrow="true"
         link to="/pages/notification/notification"
      ></uni-list-item>
    </uni-list>
    <uni-list>
      <uni-list-item
        :title="accountTypeListItem.title" :note="accountTypeListItem.note"
      ></uni-list-item >
      <uni-list-item
        :show-extra-icon="true" :extra-icon="infoIcon" title="关于"
        clickable  @click="handleInfoClick"
      ></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
  import { organizationApi, notificationApi } from 'services/http';
  import dayjs from 'dayjs';
  
  export default {
    components:{
    },
    data() {
      return {
        settingIcon: {type: 'gear'},
        infoIcon: {type: 'info'},
        messageIcon: {type: 'chat'},
        newMessageCount: "1",
        accountType: "vip",
        accountTypeListItem: {
          title: `当前版本：VIP`,
          note: "有效期至: 9999-01-01"
        }
      }
    },
    onReady () {
      this.fetchOrganizationInfo();
    },
    onShow () {
      // 消息数实时性更高
      this.fetchNotificationCount();
    },
    methods: {
      handleInfoClick () {
        uni.showModal({
            title: '关于CRM',
            content: '本软件围绕销售开展“线索-客户-机会-合同-回款”等业务活动，实现市场业绩增长目标、提升活动管理效率、降低活动运营成本，帮助广大中小企业解决销售管理问题，提升销售效率。',
            showCancel: false,
            success: function (res) {
            }
        });
      },
      fetchOrganizationInfo () {
        organizationApi.current().then((res) => {
          let {
            data: {
              data: {
                account_type, account_type_display,
                expires_at, total_users_count = "Max", used_users_count
              },
            },
          } = res;
          
          
          this.$set(this, "accountType", account_type);
          this.$set(this, "accountTypeListItem", {
            title: `当前版本：${account_type_display}`,
            note: `有效期至: ${dayjs(expires_at).format('YYYY-MM-DD')};   工号：${used_users_count}/${total_users_count}`
          });
        });
      },
      fetchNotificationCount () {
        notificationApi.newest({count_only: "1"}).then((res) => {
          let {
            data: {
              data: {
                total_count
              },
            },
          } = res;
          
          
          this.$set(this, "newMessageCount", String(total_count));
        });
      }
    }
  }
</script>

<style>

</style>