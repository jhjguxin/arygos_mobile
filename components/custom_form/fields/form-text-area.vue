<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-textarea
      v-model="inputValue"
      :autoHeight="autoHeight"
      :placeholder="customField.input_html_options.placeholder"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";
  import { ref, watch, toRef } from 'vue';

  export default {
  props: {
      name: "",
      fieldType: "",
      customField: { },
      record: { },
      klassName: "",
      value: "",
      autoHeight: { type: Boolean, default: true }
  },

    setup(props, { emit }) {
      const inputValue = ref(props.value);

      watch(() => props.value, (v) => {
        inputValue.value = v;
      });

      watch(inputValue, (v) => {
        emit("fieldChange", { name: props.customField.name, value: v });
      });

      return {
        inputValue,
        customField: toRef(props, 'customField'),
      };
    },

  };
</script>

<style>
</style>
