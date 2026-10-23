<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <select2
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="customField.input_html_options.placeholder"
      :value="localValue"
      :required="customField.required"
      :params="select2Params"
      @select="handleSelect"
      v-if="customField.input_html_options.selectType != 'tree'"
    />
    <tree-select2
      ref="treeSelect"
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="customField.input_html_options.placeholder"
      :value="localValue"
      @select="handleSelect"
      v-if="customField.input_html_options.selectType == 'tree'"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";
  import { ref, toRef, watch } from 'vue';

  export default {
  props: {
      customField: { },
      record: { },
      klassName: "",
      value: "",
      mode: { type: String, default: "selector" }
  },

    setup(props, { emit }) {
      const localValue = ref(props.value);
      watch(() => props.value, (newVal) => {
        localValue.value = newVal;
      });
      const handleSelect = (e) => {
        const { name } = props.customField;
        const value = e.value;
        localValue.value = value;
        emit("fieldChange", { name, value: value });
      };
      return {
        localValue,
        handleSelect,
        customField: toRef(props, 'customField'),
      };
    },
    computed: {
      select2Params: {
        get () {
          // REVIEW 取决于组件嵌套层数
          let form = this?.$parent?.$parent?.$parent;
          let { customField: { select_klass_name } } = this;
          let params = null;
          if (select_klass_name == "User") {
            params = { scope: "own" };
          }

          if (form && select_klass_name == "Opportunity") {
            let value = form.model?.customer?.value;

            if (value) params = { customer_id: value };
          }

          if (form && select_klass_name == "ReceivedPaymentPlan") {
            let value = form.model?.contract?.value;

            if (value) params = { contract_id: value };
          }

          return params;
        },
        set (val) {
          return val;
        }
      }
    }
  };
</script>

<style>
</style>