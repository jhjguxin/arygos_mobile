<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <attachment-upload
      maxCount="10"
      :file-list="value"
      :deletable="deletable"
      @upload="handleUpload"
    />
  </u-form-item>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      let {
        name,  fieldType, customField,
        record, klassName,
        value
      } = this.$attrs;

      return {
        name,  fieldType, customField,
        record, klassName,
        deletable: true,
        value
      }
    },
    methods: {
      handleUpload(lists) {
        let { customField: { name }} = this;
        if (_.isArray(lists)) {
          let _value = _.map(lists, (v)=> (
            v?.response?.payload['id']
          ));

         this.$emit("fieldChange", {name, value: _value});
        }
      }
    }
  }
</script>

<style>
</style>
