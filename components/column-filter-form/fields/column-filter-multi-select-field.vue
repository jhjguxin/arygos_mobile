<template>
  <u-form-item :prop="customField.name" :label="customField.label">
    <u-checkbox-group wrap @change="handleChange">
      <u-checkbox
        v-model:checked="item.checked"
        v-for="(item, index) in list" :key="index"
        :name="item.value"
        :label="item.label"
      ></u-checkbox>
    </u-checkbox-group>
    <u-button :disabled="checkedAllDisabled" @click="checkedAll">全选</u-button>
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
      value: []
  },

    setup(props) {
      const list = _.map(props.customField.collection_options, (opt) => (
        {
          label: opt[0],
          value: opt[1],
          checked: _.includes(props.value, opt[1])
        }
      ));
      return {
        list: ref(list),
        allChecked: ref(_.every(list, "checked")),
        checkedAllDisabled: ref(false),
        show: ref(false)
      };
    },
    methods: {
      checkedAll() {
        this.checkedAllDisabled = true;
        
        _.delay(()=> {
          this.checkedAllDisabled = false;
        }, 200);

        let allChecked = ! this.allChecked;
        let list = this.list.map(val => {
          val.checked = allChecked;

          return val;
        });

        this.list = list;
        this.allChecked = allChecked;

        this.handleChange(_.map(_.filter(list, "checked"), "value"));
      },
      handleChange: function (value) {
        let { customField: { name }} = this;

        this.$emit("fieldChange", {name, value});
      }
    }
  };
</script>

<style>
</style>
