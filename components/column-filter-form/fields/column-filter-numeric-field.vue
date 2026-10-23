<template>
  <u-row gutter="16" justify="space-between" align="center">
    <u-col span="2">{{customField.label}}</u-col>
    <u-col span="4">
      <u-form-item :prop="startName">
        <u-input
          :border="border" v-model="start" type="number"
          placeholder="最小值" @input="handleInput($event, 'start')"></u-input>
      </u-form-item>
    </u-col>
    ~
    <u-col span="4">
      <u-form-item :prop="endName">
        <u-input
          :border="border" v-model="end" type="number"
          placeholder="最大值" @input="handleInput($event, 'end')"></u-input>
      </u-form-item>
    </u-col>
  </u-row>
</template>

<script>
  import { ref } from 'vue';

  export default {
    props: {
      name: {}, fieldType: {}, customField: {},
      record: {}, klassName: {},
      value: { default: () => ({}) }
    },
    setup(props) {
      const { start: startFromValue, end: endFromValue } = props.value;
      const start = ref(startFromValue != null ? startFromValue : "");
      const end = ref(endFromValue != null ? endFromValue : "");
      return {
        startName: `${props.customField.name}-start`,
        endName: `${props.customField.name}-end`,
        start,
        end,
        border: "none",
      };
    },
    methods: {
      handleInput: function (value, key) {
        let { [`${key}Name`]: name } = this;

        this.$emit("fieldChange", {name, value});
      }
    }
  };
</script>

<style>
</style>