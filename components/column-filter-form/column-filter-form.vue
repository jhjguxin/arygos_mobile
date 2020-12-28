<template>
  <u-form
    :model="model" ref="uForm"
    label-width="160"
    v-if="formReady"
    class="column-filter-form"
  >
    <view class="column-filter-fields">
      <view  v-for="column in filterColumns" :key="column.name">
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
  import _ from "lodash";
  import CustomField from 'services/custom_field';
  import parseFilter from './parseFilter';

  export default {
    data() {
      let {
        klassName = "",
        model = {}
      } = this.$attrs;
      
      return {
        klassName,
        formReady: false,
        filters: [],
        customFields: [],
        model
      };
    },
    async created() {
      let { klassName } = this;
      let customFields = await CustomField.instance().fetchData(klassName);

      this.$set(this, "customFields", customFields);
      this.$set(this, "formReady", true);
    },
    methods: {
      handleFieldChange ({name, value}) {
        let { model } = this;
        model = {
          ...model,
          [`${name}`]: value
        }
        
        this.model = model;
      },
      handleSubmit () {
        let { filterColumns } = this.$attrs;
        let { model } = this;

        let filters = parseFilter({ model, filterColumns });

        this.filters = filters;
        this.$emit("filterConfirm", filters, model)
      },
      handleReset () {
        let { customFields } = this;
        let { uForm } = this.$refs;
        
        this.customFields = [];

        _.delay(()=> {
          this.customFields = customFields;
          this.filters = [];
          this.model = {};
          uForm.resetFields();          
        }, 100);
      }
    },
    computed: {
      filterColumns: {
        get () {
          let { filterColumns } = this.$attrs;
          let { customFields, model } = this;
          
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
    min-height: 800rpx;
  }
</style>
