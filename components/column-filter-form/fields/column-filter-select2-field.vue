<template>
  <u-form-item :prop="customField.name" :label="customField.label">
    <select2
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="placeholder"
      :value="localValue"
      :required="customField.required"
      :perPage="5"
      @select="handleSelect"
      v-if="customField.input_html_options.selectType != 'tree'"
    />
    <tree-select2
      ref="treeSelect"
      :title="customField.label"
      :klassName="customField.select_klass_name"
      :placeholder="placeholder"
      :value="localValue"
      @select="handleSelect"
      v-if="customField.input_html_options.selectType == 'tree'"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";
  import { ref, watch } from 'vue';

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
      const placeholder = `请选择${props.customField.label}`;
      const handleSelect = (e) => {
        const { name } = props.customField;
        const value = e.value;
        localValue.value = value;
        emit("fieldChange", { name, value: value });
      };
      return {
        localValue,
        placeholder,
        handleSelect,
        list: [],
      };
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