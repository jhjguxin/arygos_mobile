<template>
  <view>
    <u-alert-tips :type="type" :title="title" :description="description"></u-alert-tips>
  </view>
</template>

<script>
  export default {
  props: {
      title: { type: String, default: "未授权操作" }
      description: { type: String, default: "拒绝访问，请联系管理员" }
      type: { type: String, default: "error" }
  },

    data() {
      /* moved to props */
      return {
        title,
        description,
        type,
        show: true
      };
    }
  }
</script>

<style>

</style>
