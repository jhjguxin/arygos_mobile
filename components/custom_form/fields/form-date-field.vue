<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      :border="border" type="select" :select-open="selectShow" v-model="value"
      :placeholder="customField.input_html_options.placeholder" @click="selectShow = true"></u-input>
    <u-picker v-model="selectShow" mode="time" :default-time="value" :params="params" @confirm="handleConfirm"></u-picker>
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
      if (_.isNil(value)) value = "";

      return {
        name,  fieldType, customField,
        record, klassName,
        value,
        params: {
          year: true,
          month: true,
          day: true,
          hour: false,
          minute: false,
          second: false
        },
        border: false,
        selectShow: false
      }
    },
    methods: {
      handleConfirm: function (e) {
        let { customField: { name }} = this;
        let value = `${e.year}-${e.month}-${e.day}`;

        this.value = value;

        this.$emit("fieldChange", {name, value});
      }
    },
    computed: {
    }
  };
</script>

<style>
</style>
