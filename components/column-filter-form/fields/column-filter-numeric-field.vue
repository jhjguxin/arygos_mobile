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
  export default {
    props: {
      name: {}, fieldType: {}, customField: {},
      record: {}, klassName: {},
      value: { default: () => ({}) }
    },
    data() {
      let { start, end} = this.value;

      return {
        name,  fieldType, customField,
        record, klassName,
        value,
        startName: `${customField.name}-start`,
        endName: `${customField.name}-end`,
        start: start != null ? start : "",
        end: end != null ? end : "",
        border: false,
      }
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