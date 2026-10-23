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
  import _ from 'lodash';
  import {
    departmentApi,
    productCategoryApi
  } from "@/services/http";
  import { ref } from 'vue';

  export default {
    props: {
      klassName: {},
      value: {},
      required: { type: Boolean, default: false },
      title: { type: String, default: "" },
      params: { type: Object, default: () => ({}) },
      placeholder: { type: String, default: "" },
      mode: { type: String, default: "selector" }
    },
    setup(props) {
      return {
        selectedValue: ref(props.value),
        border: "none",
        showAction: false,
        list: ref(null),
        modalOpen: ref(false),
        rangeKey: "label",
        idKey: "value",
        multiple: (props.mode == "multi"),
        selectParent: true
      };
    },
    watch: {
      value(val) {
        this.selectedValue = val;
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

        this.selectedValue = value;
        this.$emit("select", {value});
      },
      fetchData: function () {
        let { klassName, params, selectedValue, mode } = this;

        let ids = (mode == "selector") ? [selectedValue?.value] : _.map(selectedValue, "value");

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

          this.list = models;
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
          let { mode, selectedValue } = this;

          if (_.isNil(selectedValue)) return;

          return mode == "selector" ? selectedValue.label : _.map(selectedValue, "label").join(", ");
        },
        set: function (value) {
        }
      }
    }
  }
</script>

<style>

</style>
