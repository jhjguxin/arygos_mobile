<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-select
      :options="list"
      v-model:current="selectValue"
      label-name="label"
      key-name="value"
      :label="placeholder"
      :show-options-label="true"
      @select="handleSelect"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";

  export default {
  props: {
      name: { },
      fieldType: { },
      customField: { },
      record: { },
      klassName: { },
      value: { }
  },

    data() {
      return {
        list: _.map(this.customField.collection_options, (opt) => (
          {
            label: opt[0],
            value: opt[1]
          }
        )),
        placeholder: this.customField.input_html_options?.placeholder,
        selectValue: this.value == null ? '' : this.value
      }
    },
    watch: {
      value(val) {
        this.selectValue = val == null ? '' : val;
      }
    },
    methods: {
      handleSelect: function (item) {
        let { customField: { name }} = this;
        let value = item ? item.value : undefined;

        this.$emit("fieldChange", {name, value});
      }
    }
  };
</script>

<style>
</style>