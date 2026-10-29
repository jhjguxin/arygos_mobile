<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <attachment-upload
      :maxCount="10"
      :file-list="value"
      :deletable="deletable"
      @upload="handleUpload"
    />
  </u-form-item>
</template>

<script>
  import _ from 'lodash';

  export default {
  props: {
      name: { type: String },
      fieldType: { type: String },
      customField: { type: Object },
      record: { type: Object },
      klassName: { type: String },
      value: { type: Array }
  },

    setup() {
      return {
        deletable: true,
      };
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
