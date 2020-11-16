<template>
  <view>
    <slot>
      <view v-if="fieldType === 'mobile_field'" >
        <u-link :href="href" v-if="displayValue">
          {{displayValue}}
        </u-link>
      </view>
      <view v-else-if="fieldType === 'tel_field'" >
        <u-link :href="href" v-if="displayValue">
          {{displayValue}}
        </u-link>
      </view>
      <view v-else-if="fieldType === 'select_field'" >
        <u-tag v-if="displayValue">
          {{displayValue}}
        </u-tag>
      </view>
      <view v-else-if="fieldType === 'field_map_field'" >
        <u-tag v-if="displayValue">
          {{displayValue}}
        </u-tag>
      </view>
      <view v-else-if="fieldType === 'multi_select'" v-for="opt in value" :key="opt">
        <u-tag>
          {{opt}}
        </u-tag>
      </view>
      <view v-else>
        {{displayValue}}
      </view>
    </slot>
  </view>
</template>


<script>
  import _ from "lodash";
  import dayjs from 'dayjs';

  export default {
    data() {
      let {
        customField = {},
        record
      } = this.$attrs;
      let { field_type: fieldType } = customField;

      return {
        customField,
        fieldType,
        record,
        href: null,
      }
    },
    methods: {
    },
    computed: {
      displayValue: {
        get () {
          let { customField: {
              custom_column_name: customColumnName, field_type: fieldType,
            }, record
          } = this;
          let value;
          
          switch (fieldType) {
            case "text_field": case "email_field":
            case "integer_field": case "float_field": case "currency_field":
              value = _.at(record, customColumnName)[0];
              break;
            case "url_field":
              value = _.at(record, customColumnName)[0];
              this.href = value;
              break;
            case "mobile_field": case "tel_field":
              value = _.at(record, customColumnName)[0];
              this.href = `tel:${value}`;
              break;
            case "text_area":
              value = _.at(record, customColumnName)[0];
              _.truncate(value, {length: 80});
              break;
            case "date_field":
              value = _.at(record, customColumnName)[0];
              value = value ? dayjs(value).format("YYYY-MM-DD") : value;
              break;
            case "datetime_field":
              value = _.at(record, customColumnName)[0];
              value = value ? dayjs(value).format("YYYY-MM-DD HH:ss") : value;
              break;
            case "select_field": case "field_map_field":
              value = _.at(record, customColumnName)[0];
              break;
            case "multi_select":
              value = _.split(_.at(record, customColumnName)[0], "，");
              break;
            case "select2_field":
              value = _.at(record, customColumnName)[0];
              break;
            case "address_select":
              value = _.at(record, customColumnName)[0];
              break;
            case "geo_address_field":
              value = _.at(record, customColumnName)[0];
              break;
          }
          
          return value;
        },
        set (value) {
        }
      }
    }
  }
</script>

<style>
</style>
