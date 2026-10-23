<template>
  <u-form-item :prop="customField.name" :label="customField.label">
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
  import _ from 'lodash';

  export default {
  props: {
      name: "",
      fieldType: "",
      customField: { },
      record: { },
      klassName: "",
      value: ""
  },

    data() {
      return {
        list: _.map(this.customField.collection_options, (opt) => (
          {
            label: opt[0],
            value: opt[1]
          }
        )),
        placeholder: `请选择${this.customField.label}`,
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

        let value = item?.value

        this.$emit("fieldChange", {[`${name}`]: value});
      }
    }
  };
</script>

<style>
</style>