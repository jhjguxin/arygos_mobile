<template>
  <view>
    <u-form
      :model="formFilters" ref="uForm"
      label-width="160"
      v-if="formFilters"
      class="column-filter-form"
    >
      <view class="column-filter-fields">
        <view v-for="(column, key, index) in filterColumns" :key="key">
          <report-filter-date-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'timeRange'"
          />
          <report-filter-year-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'year'"
          />
          <report-filter-time-unit-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'time_unit'"
          />
          <report-filter-tree-select2-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'product_category_id'"
          />
          <report-filter-select2-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'product_id'"
          />
          <report-filter-tree-select2-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'department_id'"
          />
          <report-filter-select2-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'user_id'"
          />
          <report-filter-multi-tag-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'category'"
          />
          <report-filter-multi-tag-field
            :customField="column"
            :model="formFilters"
            @fieldChange="handleFieldChange"
            v-if="key == 'status'"
          />
        </view>
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
  </view>
</template>

<script>
  import _ from 'lodash';
  export default {
  props: {
      filters: { type: Object, default: () => ({}) },
      filterColumns: { type: Object, default: () => ({}) }
  },

    data() {
      return {
        formFilters: { ...this.filters }
      };
    },
    watch: {
      filters: {
        handler(val) {
          this.formFilters = { ...val };
        },
        deep: true
      }
    },
    methods: {
      handleFieldChange (values) {
        this.formFilters = {
          ...this.formFilters,
          ...values
        }
      },
      handleSubmit () {
        this.$emit("filterConfirm", { ...this.formFilters });
      },
      handleReset () {
        let { uForm } = this.$refs;

        _.delay(()=> {
          this.formFilters = {};
          uForm.resetFields();
        }, 100);
      }
    },
  }
</script>

<style>
  .column-filter-fields {
    min-height: 60vh;
  }
</style>
