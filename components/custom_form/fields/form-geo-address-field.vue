<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      :value="value"
      :placeholder="customField.input_html_options.placeholder"
      @input="handleChange"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";
    import { Geo } from '@/services/geo';
  export default {
  props: {
      name: "",
      fieldType: "",
      customField: { },
      record: { },
      klassName: "",
      value: { }
  },

    data() {
      // props 获取数据
      /* moved to props */

      return {
        name,  fieldType, customField,
        record, klassName,
      }
    },
    methods: {
      handleChange: function (value) {
        let { customField: { name }} = this;
        let _value = {
          // lat: nil, lng: nil,
          detail_address: value
          // off_distance: nil, region_info: nil, snippet: nil,
        };

        // this.value = value;
        this.$emit("fieldChange", {name, value: _value});
      }
    }
  };
</script>

<style>
</style>
