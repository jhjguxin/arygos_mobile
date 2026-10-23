<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-select
      :options="list"
      v-model:current="selectValue"
      label-name="label"
      key-name="value"
      :label="placeholder"
      :show-options-label="true"
      @select="handleSelect"
    />
  </u-form-item>
</template>

<script>
  import _ from 'lodash';
  import { ref } from 'vue';

  export default {
  props: {
      name: "",
      fieldType: "",
      customField: { },
      record: { },
      klassName: "",
      value: ""
  },

    setup(props) {
      const list = ref(_.map(props.customField.collection_options, (opt) => (
        {
          label: opt[0],
          value: opt[1]
        }
      )));
      const placeholder = props.customField.input_html_options?.placeholder;
      const selectValue = ref(props.value == null ? '' : props.value);
      return {
        list,
        placeholder,
        selectValue,
        customField: toRef(props, 'customField'),
      };
    },
    watch: {
      value(val) {
        this.selectValue = val == null ? '' : val;
      }
    },
    methods: {
      handleSelect: function (item) {
        let { customField: { name }} = this;

        let value = item?.value

        this.$emit("fieldChange", {name, value});
      }
    }
  };
</script>

<style>
</style>