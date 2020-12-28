<template>
  <view>
    <u-alert-tips :type="type" :title="title" :description="description"></u-alert-tips>
  </view>
</template>

<script>
  export default {
    data() {
      let {
        title = "未授权操作",
        description = "拒绝访问，请联系管理员",
        type = "error"
      } = this.$attrs;
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
