<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      v-model="value"
      :placeholder="customField.input_html_options.placeholder"
      type="number"
      @input="handleChange"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      // props 获取数据
      let {
        name,  fieldType, customField,
        record, klassName,
        value
      } = this.$attrs;

      return {
        name,  fieldType, customField,
        record, klassName,
        value
      }
    },
    methods: {
      handleChange: function (value) {
        let { customField: { name }} = this;

        this.$emit("fieldChange", {name, value});
      }
    },
  };
</script>

<style>
</style>
