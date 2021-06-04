<template>
  <u-form
    :model="filters" ref="uForm"
    label-width="160"
    v-if="formReady"
    class="approval-filter-form"
  >
    <view class="column-filter-fields">
      <u-form-item prop="user" label="用户">
        <select2
          title="用户"
          klassName="User"
          placeholder="请选择用户"
          mode="selector"
          perPage = "5"
          :value="filters.user"
          @select="handleUserSelect"
        />
      </u-form-item>
    </view>
    <u-row gutter="16" justify="space-between" align="bottom">
      <u-col span="5">
        <u-button type="primary" @click="handleSubmit">确定</u-button>
      </u-col>
      <u-col span="5">
        <u-button @click="handleReset">重置</u-button>
      </u-col>
    </u-row>
  </u-form>
</template>

<script>
  export default {
    data() {
      let {
        filters = {},
      } = this.$attrs;

      return {
        filters,
        formReady: false
      };
    },
    created() {
      // REVIEW 因为每次下拉菜单重新被展开，组建会被重新初始化但是 Form并没有因此强制重新渲染
      this.formReady = true;
    },
    methods: {
      handleUserSelect(e) {
        let { filters } = this;
        let value = e.value;

        filters.user = value;
        this.filters = filters;
      },
      handleSubmit(e){
        let { filters } = this;

        this.filters = filters;
        this.$emit("filterConfirm", filters);
      },
      handleReset(e){
        let filters = {};
        let { uForm } = this.$refs;

        this.filters = filters;
        uForm.resetFields();

        _.delay(()=> {
          this.$emit("filterConfirm", filters);
        }, 100);
      }
    }
  }
</script>

<style>
  .column-filter-fields {
    min-height: 60vh;
  }
</style>
