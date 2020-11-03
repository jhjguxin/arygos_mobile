<template>
  <!-- uni-app REVIEW 目前不支持动态组件 -->
  <!--custom-form-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
  ></custom-form-field-->

  <form-text-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-if="componentName === 'form-text-field'"
  ></form-text-field>

  <form-text-area
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-text-area'"
  ></form-text-area>

  <form-email-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-email-field'"
  ></form-email-field>

  <form-mobile-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-mobile-field'"
  ></form-mobile-field>

  <form-url-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-url-field'"
  ></form-url-field>

  <form-tel-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-tel-field'"
  ></form-tel-field>

  <form-integer-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-integer-field'">
  ></form-integer-field>

  <form-float-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-float-field'"
  ></form-float-field>

  <form-currency-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-currency-field'"
  ></form-currency-field>

  <form-datetime-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-datetime-field'"
  ></form-datetime-field>

  <form-date-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-date-field'"
  ></form-date-field>

  <form-select-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-select-field'"
  ></form-select-field>

  <form-multi-select
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-multi-select'"
  ></form-multi-select>

  <form-select2-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-select2-field'"
  ></form-select2-field>

  <form-address-select
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-address-select'"
  ></form-address-select>

  <form-field-map-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-field-map-field'"
  ></form-field-map-field>

  <form-file-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-file-field'"
  ></form-file-field>

  <form-geo-address-field
    v-bind:customField="customField"
    v-bind:record="record"
    v-bind:klassName="klassName"
    v-bind:value="value"
    @fieldChange="handleFieldChange"
    v-else-if="componentName === 'form-geo-address-field'"
  ></form-geo-address-field>

  <view v-else>
    <!-- 不支持的组件类型 -->
  </view>

</template>

<script>
  import _ from "lodash";
  import getFormField from "./getFormField";

  export default {
    data() {
      // props 获取数据
      let {
        name,  fieldType, customField,
        record, klassName,
        value
      } = this.$attrs;

      let componentName =  getFormField({
        customField
      });

      return {
        name, fieldType, customField,
        klassName,
        record, value,
        componentName
      }
    },
    mounted () {
    },
    methods: {
      handleFieldChange: function ({name, value}) {
        this.$emit("fieldChange", {name, value});
      }
    }
  };
</script>

<style>
</style>
