<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      :border="border" type="select" :select-open="selectShow" v-model="localValue"
      :placeholder="customField.input_html_options.placeholder" @click="selectShow = true"></u-input>
    <u-datetime-picker style="flex:none" :show="selectShow" mode="datetime" :modelValue="localValue" @confirm="handleConfirm" @close="selectShow = false" @cancel="selectShow = false"></u-datetime-picker>
  </u-form-item>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { ref, watch } from 'vue';

  export default {
  props: {
      name: "",
      fieldType: "",
      customField: { },
      record: { },
      klassName: "",
      value: ""
  },

    setup(props, { emit }) {
      const localValue = ref(_.isNil(props.value) ? "" : props.value);
      watch(() => props.value, (newVal) => {
        localValue.value = newVal;
      });
      const selectShow = ref(false);
      const handleConfirm = (e) => {
        const { name } = props.customField;
        const value = dayjs(Number(e.value)).format("YYYY-MM-DD HH:mm:ss");
        localValue.value = value;
        selectShow.value = false;
        emit("fieldChange", { name, value });
      };
      return {
        localValue,
        selectShow,
        handleConfirm,
        customField: toRef(props, 'customField'),
        border: "none",
      };
    },
    computed: {
    }
  };
</script>

<style>
</style>
