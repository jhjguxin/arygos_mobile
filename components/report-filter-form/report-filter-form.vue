<template>
  <view>
    <u-form
      :model="filters" ref="uForm"
      label-width="160"
      v-if="filters"
      class="column-filter-form"
    >
      <view class="column-filter-fields">
        <view v-for="(column, key, index) in filterColumns" :key="key">
          <report-filter-date-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'timeRange'"
          />
          <report-filter-year-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'year'"
          />
          <report-filter-time-unit-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'time_unit'"
          />
          <report-filter-tree-select2-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'product_category_id'"
          />
          <report-filter-select2-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'product_id'"
          />
          <report-filter-tree-select2-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'department_id'"
          />
          <report-filter-select2-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'user_id'"
          />
          <report-filter-multi-tag-field
            :customField="column"
            :model="filters"
            @fieldChange="handleFieldChange"
            v-if="key == 'category'"
          />
          <report-filter-multi-tag-field
            :customField="column"
            :model="filters"
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
  export default {
    data() {
      let {
        filters,
        filterColumns
      } = this.$attrs;

      return {
        filters,
        filterColumns
      };
    },
    methods: {
      handleFieldChange (values) {
        let { filters } = this;
        filters = {
          ...filters,
          ...values
        }

        this.filters = filters;
      },
      handleSubmit () {
        let { filterColumns } = this.$attrs;
        let { filters } = this;

        // let filters = parseFilter({ filters, filterColumns });

        this.$emit("filterConfirm", filters);
      },
      handleReset () {
        // let { filterColumns } = this;
        let { uForm } = this.$refs;

        _.delay(()=> {
          this.filters = {};
          uForm.resetFields();
        }, 100);
      }
    },
  }
</script>

<style>
  .column-filter-fields {
    min-height: 800rpx;
  }
</style>
