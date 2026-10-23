<template>
  <u-form
    :model="formModel" ref="uForm"
    label-width="160"
    v-if="formReady"
    class="column-filter-form"
  >
    <view class="column-filter-fields">
      <view  v-for="column in resolvedFilterColumns" :key="column.name">
        <column-filter-field-map-field
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'field_map_field'"
        />
        <column-filter-select-field
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'select_field'"
        />
        <column-filter-multi-select-field
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'multi_select'"
        />
        <column-filter-select2-field
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'select2_field'"
        />
        <column-filter-date-field
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'date_field'"
        />
        <column-filter-datetime-field
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'datetime_field'"
        />
        <column-filter-address-select
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'address_select'"
        />
        <column-filter-numeric-field
          :customField="column.customField"
          :value="column.value"
          @fieldChange="handleFieldChange"
          v-if="column.field_type === 'integer_field'
             || column.field_type === 'float_field'
             || column.field_type === 'currency_field'"
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
</template>

<script>
  import _ from 'lodash';
  import CustomField from '@/services/custom_field';
  import parseFilter from '@/components/column-filter-form/parseFilter';

  export default {
    props: {
      klassName: { type: String, default: '' },
      model: { type: Object, default: () => ({}) },
      customFields: { type: Array, default: () => [] },
      filterColumns: { type: Array, default: () => [] }
    },
    data() {
      return {
        formReady: false,
        filters: [],
        resolvedCustomFields: [],
        formModel: {},
      };
    },
    async created() {
      let { klassName } = this;
      let resolvedCustomFields = this.customFields;

      if (resolvedCustomFields.length == 0) {
        resolvedCustomFields = await CustomField.instance().fetchData(klassName);
      }

      this.resolvedCustomFields = resolvedCustomFields;
      this.formModel = this.model;
      this.formReady = true;
    },
    methods: {
      handleFieldChange ({name, value}) {
        let model = this.formModel;
        model = {
          ...model,
          [`${name}`]: value
        }

        this.formModel = model;
      },
      handleSubmit () {
        let { filterColumns } = this;
        let { formModel: model } = this;

        // REVIEW 数字范围交叉校验：最小值不能大于最大值，阻止提交
        let invalidNumeric = _.find(filterColumns, (column) => {
          if (! _.includes(['integer_field', 'float_field', 'currency_field'], column.field_type)) {
            return false;
          }

          let start = model[`${column.name}-start`];
          let end = model[`${column.name}-end`];

          return (start !== "" && start != null)
            && (end !== "" && end != null)
            && parseFloat(start) > parseFloat(end);
        });

        if (invalidNumeric) {
          uni.showToast({
            icon: 'none',
            title: "最小值不能大于最大值",
            duration: 1000
          });
          return;
        }

        let filters = parseFilter({ model, filterColumns });

        this.filters = filters;
        this.$emit("filterConfirm", filters, model)
      },
      handleReset () {
        let { resolvedCustomFields: customFields } = this;
        let { uForm } = this.$refs;

        this.resolvedCustomFields = [];

        _.delay(()=> {
          this.resolvedCustomFields = customFields;
          this.filters = [];
          this.formModel = {};
          uForm.resetFields();
        }, 100);
      }
    },
    computed: {
      resolvedFilterColumns: {
        get () {
          let { filterColumns } = this;
          let { resolvedCustomFields: customFields, formModel: model } = this;

          if (_.isEmpty(customFields)) return null;

          filterColumns = _.map(filterColumns, (column)=> {
            let customField = _.find(customFields, (customField) => (
              customField.name == column.name
            ));
            let { name } = column;

            // REVIEW 重建初始化选中值因为 dropdown 组件收起会销毁当前组件
            let value;
            if (_.includes(['datetime_field', 'date_field'], customField.field_type)) {
              value = {
                start: model[`${name}-start`],
                end: model[`${name}-end`]
              };
            } else if (_.includes(['integer_field', 'float_field', 'currency_field'], customField.field_type)) {
              value = {
                start: model[`${name}-start`],
                end: model[`${name}-end`]
              };
            } else {
              value = model[name];
            }

            return {
              ...column,
              customField,
              value
            };
          });

          return filterColumns;
        },
        set (value) {
        }
      }
    }
  }
</script>

<style>
  .column-filter-fields {
    min-height: 60vh;
  }
</style>
