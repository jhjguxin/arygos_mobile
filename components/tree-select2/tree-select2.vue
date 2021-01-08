<template>
  <view>
    <u-input
      :border="border" type="select" :select-open="modalOpen" v-model="valueDisplay"
      :placeholder="placeholder"
      @click="handleShowSelect"></u-input>

    <tki-tree
      ref="tkitree"
      :title="title"
      :range="list" :rangeKey="rangeKey" :idKey="idKey"
      :selectParent="selectParent"
      :multiple="multiple"
      confirmColor="#4e8af7"
      @confirm="handleConfirm"
      v-if="list"
    />
  </view>
</template>

<script>
  import _ from "lodash";
  import {
    departmentApi,
    productCategoryApi
  } from "services/http";

  export default {
    data() {
      // props 获取数据
      let {
        klassName,
        value = {},
        required,
        title = "",
        params = {},
        placeholder,
        mode = "selector" // selector 单选，多选 multi
      } = this.$attrs;

      return {
        klassName,
        value, mode,
        required,
        title,
        params,
        placeholder,
        border: false,
        showAction: false,
        list: null,
        modalOpen: false,
        rangeKey: "label",
        idKey: "value",
        multiple:  (mode == "multi"),
        selectParent: true
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      handleConfirm: function (value) {
        let { mode, list } = this;

        this.modalOpen = false;
        this.$refs.tkitree._hide();

        value = (mode == "selector") ? value[0] : value;

        this.$set(this, "value", value);
        this.$emit("select", {value});
      },
      fetchData: function () {
        let { klassName, params, value, mode } = this;

        let ids = (mode == "selector") ? [value?.value] : _.map(value, "value");

        this.requestApi({ klassName, params }).then((res) => {
          let {
            data: {
              data: models
            },
          } = res;
          let formater = (list) => (
            _.map(list, (item) => (
              {
                id: item.id,
                name: item.name,
                label: item.name,
                value: item.id,
                checked: _.includes(ids, item.id),
                children: _.isArray(item.children) ? formater(item.children) : []
              }
            ))
          )
          models = formater(models);

          this.$set(this, "list", models);
        })
      },
      requestApi: function ({ klassName, params = {} }) {
        let api;
        switch (klassName) {
          case 'Department':
            api = departmentApi.tree({ ...params });
            return api;
          case 'ProductCategory':
            api = productCategoryApi.tree({ ...params });
            return api;
        }
      },
      handleShowSelect: function () {
        this.modalOpen = true;

        this.$refs.tkitree._show();
      },
    },
    computed: {
      valueDisplay: {
        get: function() {
          let { mode, value } = this;

          if (_.isNil(value)) return;

          return mode == "selector" ? value.label : _.map(value, "label").join(", ");
        },
        set: function (value) {
        }
      }
    }
  }
</script>

<style>

</style>
