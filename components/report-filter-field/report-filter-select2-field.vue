<template>
  <u-form-item :prop="customField.name" :label="customField.label">
    <select2
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="placeholder"
      :required="customField.required"
      mode="multi"
      perPage = "5"
      @select="handleSelect"
    />
  </u-form-item>
</template>

<script>
  import _ from 'lodash';

  export default {
  props: {
      customField: { },
      klassName: ""
  },

    data() {
      // props 获取数据
      /* moved to props */

      return {
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