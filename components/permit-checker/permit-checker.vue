<template>
  <u-modal
    :title="modal.title"
    :content="modal.content"
    v-model="modal.show"
    :show-cancel-button="modal.showCancelButton"
    :confirm-text="modal.confirmText"
    @confirm="handleConfirm"
    v-if="! hasPermit"
  ></u-modal>
</template>

<script>
  import _ from 'lodash';
  import Feature from 'services/feature';
  import Policy from 'services/policy';

  export default {
    data() {
      let {
        authKey, content = "你没有权限操作！请联系管理员，点击确定后返回",
        noPermitUrl = "/pages/workbench/workbench"
      } = this.$attrs;
      return {
        authKey,
        hasPermit: true,
        noPermitUrl,
        modal: {
          title: "警告",
          content,
          show: false,
          showCancelButton: false,
          confirmText: "确定"
        }
      };
    },
    async mounted (){
      let { authKey } = this;
      let policy = await Policy.instance();

      if (policy.noPermission({ authKey })) {
        this.hasPermit = false;
        _.delay(()=> {
          this.modal.show = true;
        }, 50)
      }
    },
    methods: {
      handleConfirm () {
        let { noPermitUrl: url } = this;
        if ( url == "/pages/workbench/workbench") {
          uni.switchTab({
            url
          });
        } else {
          uni.redirectTo({
            url
          });
        }
      }
    }
  }
</script>

<style>

</style>
