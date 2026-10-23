<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      v-model="inputValue"
      :placeholder="customField.input_html_options.placeholder"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";
  import { ref, watch, toRef } from 'vue';

  export default {
  props: {
      customField: { },
      record: { },
      klassName: "",
      value: ""
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
    mounted () {
      // REVIEW 获取 form 组件
      // form = this.$u.$parent.call(this, 'u-form');
    },
    methods: {
    }
  };
</script>

<style>
</style>
