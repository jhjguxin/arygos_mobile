<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-checkbox-group wrap @change="handleChange">
      <u-checkbox
        v-model="item.checked"
        v-for="(item, index) in list" :key="index"
        :name="item.value"
      >{{item.label}}</u-checkbox>
    </u-checkbox-group>
    <u-button :disabled="checkedAllDisabled" @click="checkedAll">全选</u-button>
  </u-form-item>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      // props 获取数据
      let {
        name,  fieldType, customField,
        record, klassName,
        value
      } = this.$attrs;
      let list = _.map(customField.collection_options, (opt) => (
        {
          label: opt[0],
          value: opt[1],
          checked: _.includes(value, opt[1])
        }
      ));
      let allChecked = _.every(list, "checked");

      return {
        name,  fieldType, customField,
        record, klassName,
        list,
        value,
        allChecked,
        checkedAllDisabled: false,
        show: false
      }
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

        this.$set(this, "list", list);
        this.$set(this, "allChecked", allChecked);

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
