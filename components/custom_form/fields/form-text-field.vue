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

  export default {
  props: {
      customField: { },
      record: { },
      klassName: "",
      value: ""
  },

    mounted () {
      // REVIEW 获取 form 组件
      // form = this.$u.$parent.call(this, 'u-form');
    },
    methods: {
      handleChange: function (value) {
        let { customField: { name }} = this;

        // this.value = value;
        this.$emit("fieldChange", {name, value});
      }
    }
  };
</script>

<style>
</style>
