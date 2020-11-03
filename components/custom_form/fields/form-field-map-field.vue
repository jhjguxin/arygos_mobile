<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      :border="border" type="select" :select-open="selectShow" v-model="valueDisplay"
      :placeholder="customField.input_html_options.placeholder" @click="selectShow = true"></u-input>
    <u-select mode="single-column" :list="list" v-model="selectShow" @confirm="handleConfirm"></u-select>
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
      let list = _.map(customField.collection_options, (opt) => (
        {
          label: opt[0],
          value: opt[1]
        }
      ));

      return {
        name,  fieldType, customField,
        record, klassName,
        list,
        value,
        border: false,
        selectShow: false
      }
    },
    methods: {
      handleConfirm: function (e) {
        let { customField: { name }} = this;
        let value = e[0] ? e[0].value : undefined;

        this.value = value;
        this.$emit("fieldChange", {name, value});
      }
    },
    computed: {
      valueDisplay: {
        get: function () {
          let { list, value } = this;

          return _.find(list, (opt)=> opt.value == value)?.label
        },
        set: function (value) {
          console.log(value)
        }
      }
    }
  };
</script>

<style>
</style>
