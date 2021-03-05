<template>
  <u-form-item :prop="customField.name" :label="customField.label">
    <tree-select2
      ref="treeSelect"
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="placeholder"
      mode="multi"
      :value="value"
      @select="handleSelect"
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
        klassName,
      } = this.$attrs;

      return {
        customField,
        klassName,
        value: null,
        placeholder: `请选择${customField.label}`,
        list: [],
      }
    },
    methods: {
      handleSelect: function (e) {
        let { customField: { name }} = this;
        let value = e.value;

        this.value = value;
        this.$emit("fieldChange", {[`${name}`]: _.map(value, "value")});
      }
    },
    computed: {
      valueDisplay: {
        get: function () {
          let { value } = this;

          return value?.name;
        },
        set: function (value) {
        }
      }
    }
  };
</script>

<style>
</style>