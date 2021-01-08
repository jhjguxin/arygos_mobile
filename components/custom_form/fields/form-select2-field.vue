<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <select2
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="customField.input_html_options.placeholder"
      :value="value"
      :required="customField.required"
      @select="handleSelect"
      v-if="customField.input_html_options.selectType != 'tree'"
    />
    <tree-select2
      ref="treeSelect"
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="customField.input_html_options.placeholder"
      :value="value"
      @select="handleSelect"
      v-if="customField.input_html_options.selectType == 'tree'"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      // props 获取数据
      let {
        customField,
        record, klassName,
        value,
        mode = "selector"
      } = this.$attrs;

      return {
        customField,
        record, klassName,
        value, mode
      }
    },
    methods: {
      handleSelect: function (e) {
        let { customField: { name }} = this;
        let value = e.value;

        this.value = value;
        this.$emit("fieldChange", {name, value: value});
      }
    }
  };
</script>

<style>
</style>