<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      :border="border" type="select" :select-open="selectShow" :value="value"
      :placeholder="customField.input_html_options.placeholder" @click="selectShow = true"></u-input>
    <u-datetime-picker style="flex:none" :show="selectShow" mode="datetime" :modelValue="value" @confirm="handleConfirm" @close="selectShow = false" @cancel="selectShow = false"></u-datetime-picker>
  </u-form-item>
</template>

<script>
  import _ from "lodash";
  import dayjs from 'dayjs';

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
      // props 获取数据
      /* moved to props */
      if (_.isNil(value)) value = "";

      return {
        name,  fieldType, customField,
        record, klassName,
        params: {
          year: true,
          month: true,
          day: true,
          hour: true,
          minute: true,
          second: false
        },
        border: "none",
        selectShow: false
      }
    },
    methods: {
      handleConfirm: function (e) {
        let { customField: { name }} = this;
        let value = dayjs(Number(e.value)).format("YYYY-MM-DD HH:mm:ss");

        this.value = value;
        this.selectShow = false;

        this.$emit("fieldChange", {name, value});
      }
    },
    computed: {
    }
  };
</script>

<style>
</style>
