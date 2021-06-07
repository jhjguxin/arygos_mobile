<template>
  <view class="approval-timeline" :style="style">
    <u-time-line class="timeLine" v-if="approve_status != 'await_sumbit'">
      <!-- 申请节点 -->
      <u-time-line-item
        nodeTop="2"
      >
        <template v-slot:node>
          <view class="u-node" :style="node.applying.style">
            <!-- 此处为uView的icon组件 -->
            <u-icon name="info-circle-fill" color="#fff" :size="24"></u-icon>
          </view>
        </template>
        <template v-slot:content>
            <view class="u-padding-10">
              <view class="u-font-sm u-line-2">
                {{approvalDetail.applier.name}}<text class="u-m-l-10 u-type-primary">发起人</text>  <text class="u-m-l-10 u-type-info">{{approvalDetail.submitApplyingAt}}</text>
              </view>
              <view class="u-font-sm">
                <text class="u-type-primary u-m-r-10">发起审批</text> 审批通过后抄送给：<text class="u-m-l-10 u-type-info">{{approvalDetail.notifyUserNames}}</text>
              </view>
            </view>
        </template>
      </u-time-line-item>
      
      <!-- 审批步骤 -->
      <u-time-line-item
        nodeTop="2"
          v-for="(step, index) in node.steps" :key="step.level"
        v-if="node.steps.length > 0"
      >
        <template v-slot:node>
          <view class="u-node" :style="step.node.style">
            <!-- 此处为uView的icon组件 -->
            <u-icon :name="step.node.icon" color="#fff" :size="24"></u-icon>
          </view>
        </template>
        <template v-slot:content>
            <view class="u-padding-10">
              <view class="u-font-sm u-line-2">
                <text class="u-type-primary">{{step.level}}级审批 </text>  <text class="u-m-l-10 u-type-primary">{{step.type_display}}</text>  <text class="u-m-l-10 u-type-info">{{step.approvers.join(", ")}}</text>
              </view>
              <view class="u-font-sm" v-for="(approval_record, index) in step.approval_records" :key="approval_record.id">
                <text class="u-type-info u-m-r-10">{{approval_record.createdAt}}</text>
                <text class="u-type-info u-m-r-10">{{approval_record.user.name}}</text>
                <text class="u-type-primary u-m-r-10">{{approval_record.action_i18n}}</text>
                <text class="u-type-info">原因：{{approval_record.note}}</Text>
              </view>
            </view>
        </template>
      </u-time-line-item>
      <!-- 审批结果 -->
      <u-time-line-item
        nodeTop="2"
        v-if="isApproveFinished"
      >
        <template v-slot:node>
          <view class="u-node" :style="node.result.style">
            <!-- 此处为uView的icon组件 -->
            <u-icon :name="node.result.icon" color="#fff" :size="24"></u-icon>
          </view>
        </template>
        <template v-slot:content>
            <view class="u-padding-10">
              <view class="u-font-sm u-line-2">
                <text class="u-type-primary">结束</text>  <text class="u-m-l-10 u-type-info">{{approvalDetail.finishApproveAt}}</text>
              </view>
              <view class="u-font-sm">
                <text class="u-type-success" v-if="approve_status == 'approved'">审批通过</text>
                <text class="u-type-error" v-if="approve_status == 'rejected'">审批未通过</text>
              </view>
            </view>
        </template>
      </u-time-line-item>
    </u-time-line>
    <u-empty v-else text="待提交审批" mode="history"></u-empty>
  </view>
</template>

<script>
  import ApprovalSetting from 'services/approval_setting';
  import dayjs from 'dayjs';

  export default {
    name:"approval-timeline",
    data() {
      let { style = "height: 55vh;", approvalDetail } = this.$attrs;

      approvalDetail = {
        ...approvalDetail,
        submitApplyingAt: approvalDetail.submit_applying_at ? dayjs(approvalDetail.submit_applying_at).format("YYYY-MM-DD HH:mm") : null,
        finishApproveAt: approvalDetail.finish_approve_at ? dayjs(approvalDetail.finish_approve_at).format("YYYY-MM-DD HH:mm") : null,
        notifyUserNames: _.map(approvalDetail.notify_users, "name").join(", ")
      };

      return {
        approvalDetail,
        approve_status: approvalDetail?.approve_status,
        isApproveFinished: _.includes(["approved", "rejected"], approvalDetail?.approve_status),
        style,
        node: {
          applying: {
            style: "background: green"
          },
          steps: [],
          result: {
            style: "background: green"
          },
        }
      };
    },
    async mounted() {
      let { approvalDetail } = this;
      let { approvable_type, approvable_id } = approvalDetail;
      let approvalSetting = await ApprovalSetting.instance();
      let approvalConfig = approvalSetting.get({name: approvable_type});
      
      this.node.steps = this.stepsFormat({approvalConfig, approvalDetail});
      
      this.node.result = {
        style: approvalDetail.approve_status == "approved" ? "background: green" : "background: red",
        icon: approvalDetail.approve_status == "approved" ? "checkmark-circle-fill" : "close-circle-fill",
        
      }

      this.approvalConfig = approvalConfig;
    },
    methods: {
      stepsFormat({approvalConfig, approvalDetail}) {
        let { step, approval_records, approve_status } = approvalDetail;
        let steps = _.map(approvalConfig.steps, (stepConfig) => {
          
          let approval_records = _.filter(approvalDetail.approval_records, (record) => record.level == stepConfig.level);
          approval_records = _.map(approval_records, (approval_record)=> (
            {
              ...approval_record,
              createdAt: dayjs(approval_record.created_at).format("MM-DD HH:mm")
            }
          ))

          let approvers = _.map(stepConfig.users, "name")
          if (_.isEmpty(stepConfig.users)) {
            approvers = _.map(stepConfig.roles, "name")
          }

          let type_display = stepConfig.type_display;
          if (stepConfig.type == "specified_jointly") {
            if (stepConfig.min_pass_member > 1) {
              type_display = `${type_display}（${stepConfig.min_pass_member}人）`
            } else {
              type_display = `${type_display}（所有人）`
            }
          }

          let step_finished = (stepConfig.level < step || (_.includes(["approved", "rejected"], approve_status) && step == stepConfig.level));

          let finish_approve_at;
          if (step_finished) {
            finish_approve_at = _.last(approval_records)?.created_at;
          }
          let finishApproveAt = finish_approve_at ? dayjs(finish_approve_at).format("YYYY-MM-DD HH:mm") : null;
      

          let style = "background: blue";
          let icon = "eye-fill";
          if (
            _.some(
              approval_records,
              (approval_record) => _.includes(["reject", "deny"], approval_record.action)
            )
          ) {
            icon = "close-circle-fill";
            style = "background: red";
          }
          if (step_finished) {
            if (
              _.every(
                approval_records,
                (approval_record) => "approve" == approval_record.action
              )
            ) {
              icon = "checkmark-circle-fill";
              style = "background: green";
            }
          }

          if (stepConfig.level > step) {
            icon = "clock-fill";
            style = "background: gray";
          }

          return {
            node: {
              style,
              icon
            },
            level: stepConfig.level,
            approval_records,
            approvers,
            type_display,
            step_finished,
            finishApproveAt
          }
        })

        return steps;
      }
    }
  }
</script>

<style>
  .approval-timeline {
    padding-left: 32rpx;
    overflow-y: scroll;
  }

  .u-node {
    width: 44rpx;
    height: 44rpx;
    border-radius: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d0d0d0;
  }
</style>
