<template>
  <view :style="style">
    <slot>
      <u-link v-if="fieldType === 'mobile_field'"  :href="href">
        {{displayValue}}
      </u-link>
      <u-link v-else-if="fieldType === 'tel_field'"  :href="href">
        {{displayValue}}
      </u-link>
      <u-link v-else-if="fieldType === 'url_field'"  :href="href">
        {{displayValue}}
      </u-link>
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
      <u-tag v-else-if="fieldType === 'select_field' && displayValue"  :text="displayValue">
      </u-tag>
      <u-tag v-else-if="fieldType === 'field_map_field' && displayValue" :text="displayValue">
      </u-tag>
      <u-tag v-else-if="fieldType === 'multi_select' && displayValue" v-for="opt in displayValue" :key="opt" :text="opt">
      </u-tag>
      <view v-else-if="fieldType === 'file_field' && displayValue">
        <u-row v-for="item in displayValue"
        :key="item.id" style="width: 45vh;">
          <u-col span="10">{{item.name}}</u-col>
          <u-col span="2">
            <u-link :href="item.file_url" >
              查看
            </u-link>
          </u-col>
        </u-row>
      </view>
      <text v-else>
        {{displayValue}}
      </text>
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
        style = {},
        inline
      } = this.$attrs;
      let { field_type: fieldType } = customField;
      if (inline) style = {
        ...style,
        display: "inline-block"
      };

      return {
        customField,
        fieldType,
        style,
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
          let {
            record
          } = this.$attrs;
          let {
            customField: {
              name,
              custom_column_name: customColumnName, field_type: fieldType,
              select_klass_name: selectKlassName
            }
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
              let id = _.at(record, `${name}_id`)[0];
              const urlMap = {
                Lead: `/pages/lead/leadShow/leadShow?id=${id}`,
                Customer: `/pages/customer/customerShow/customerShow?id=${id}`,
                Contact: `/pages/contact/contactShow/contactShow?id=${id}`,
                Opportunity: `/pages/opportunity/opportunityShow/opportunityShow?id=${id}`,
                Contract: `/pages/contract/contractShow/contractShow?id=${id}`,
                ReceivedPaymentPlan: `/pages/receivedPaymentPlan/receivedPaymentPlanShow/receivedPaymentPlanShow?id=${id}`,
              }
              this.href = urlMap[selectKlassName];
              break;
            case "address_select":
              value = _.at(record, customColumnName)[0];
              break;
            case "geo_address_field":
              value = _.at(record, customColumnName)[0];
              break;
            case "file_field":
              value = _.at(record, customColumnName)[0];
              value = _.map(value, (v)=> (
                {
                  name: _.truncate(v.name, {length: 20}),
                  file_url: v.file_url
                }
              ))
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