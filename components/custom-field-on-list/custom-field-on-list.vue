<template>
  <view>
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
    <text v-else-if="fieldType === 'select2_field'">
      <text
        v-if="href" style="color: #2979ff;"
        @tap.stop="handleSelect2Click"
      >
        {{displayValue}}
      </text>
      <text v-else>
        {{displayValue}}
      </text>
    </text>
    <view v-else-if="fieldType === 'select_field'" >
      <u-tag :text="displayValue" v-if="displayValue"/>
    </view>
    <view v-else-if="fieldType === 'field_map_field'" >
      <u-tag :text="displayValue" v-if="displayValue"/>
    </view>
    <view v-else-if="fieldType === 'multi_select'" v-for="opt in value" :key="opt">
      <u-tag :text="opt"/>
    </view>
    <view v-else>
      {{displayValue}}
    </view>
  </view>
</template>


<script>
  import _ from "lodash";
  import dayjs from 'dayjs';

  export default {
    data() {
      let {
        customField = {}
      } = this.$attrs;
      let { field_type: fieldType } = customField;

      return {
        customField,
        fieldType,
        href: null,
      }
    },
    methods: {
      handleSelect2Click (e) {
        let { href: url } = this;
        e.stopPropagation();

        uni.navigateTo({
          url
        })
      }
    },
    computed: {
      displayValue: {
        get () {
          let { customField: {
            name,
            custom_column_name: customColumnName, field_type: fieldType,
            select_klass_name: selectKlassName
            }
          } = this;
          let {
            record
          } = this.$attrs;
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
              value = _.truncate(value, {length: 100});
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
              let id = _.at(record, `${name}_id`)[0];
              const urlMap = {
                Lead: `/pages/lead/leadShow/leadShow?id=${id}`,
                Customer: `/pages/customer/customerShow/customerShow?id=${id}`,
                Contact: `/pages/contact/contactShow/contactShow?id=${id}`,
                Opportunity: `/pages/opportunity/opportunityShow/opportunityShow?id=${id}`,
                Contract: `/pages/contract/contractShow/contractShow?id=${id}`,
              }
              this.href = urlMap[selectKlassName];
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
