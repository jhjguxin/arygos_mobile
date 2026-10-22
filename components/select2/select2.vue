<template>
  <view :class="className">
    <u-input
      :border="border" type="select" :select-open="modalOpen" v-model="valueDisplay"
      :placeholder="placeholder"
      @click="handleShowSelect"></u-input>
    <u-modal
      :title="title" v-model="modalOpen" @confirm="handleConfirm" @cancel="handleCancel"
      :show-cancel-button="showCancelButton"
      :width="width"
    >
      <view class="wrap">
        <u-row gutter="16">
          <u-col span="12">
            <u-search
              :placeholder="searchPlaceholder" v-model="searchQuery" :show-action="showAction"
              @search="handleSearch"
            ></u-search>
          </u-col>
          <u-col span="12">
            <uni-list
              v-for="item in list"
              v-bind:key="item.value"
             >
              <uni-list-item
                :title="item.label"
                showSwitch
                :switchChecked="item.checked"
                @switchChange="handleSwitchChange($event, item.value)"
              ></uni-list-item>
            </uni-list>
            <u-loadmore :status="status" @loadmore="handleLoadmore"/>
          </u-col>
        </u-row>
      </view>
    </u-modal>
  </view>
</template>

<script>
  import _ from "lodash";
  import {
    userApi,
    departmentApi,
    leadApi,
    customerApi,
    contactApi,
    opportunityApi,
    contractApi,
    receivedPaymentPlanApi,
    productApi,
    productCategoryApi,
    customerCommonSettingApi
  } from "@/services/http";


  export default {
    props: {
      klassName: { type: String },
      value: { type: [Object, Array], default: () => ({}) },
      required: { type: Boolean, default: false },
      title: { type: String, default: '' },
      width: { type: String, default: '80%' },
      placeholder: { type: String, default: '' },
      perPage: { type: Number, default: 10 },
      searchPlaceholder: { type: String, default: '输入要搜索的内容' },
      mode: { type: String, default: 'selector' },
      params: { type: Object, default: () => ({}) },
      query: { type: String, default: '' }
    },
    data() {
      return {
        selectedValue: this.value,
        searchQuery: this.query,
        className: "select2-container",
        status: "nomore",
        showCancelButton: true,
        page: 1,
        border: "none",
        showAction: false,
        list: [],
        modalOpen: false
      }
    },
    created() {
    },
    methods: {
      handleConfirm: function () {
        let { mode, list } = this;
        this.modalOpen = false;

        let value = (mode == "selector") ? _.find(list, "checked") : _.filter(list, "checked");

        this.selectedValue = value;

        this.$emit("select", {value});
      },
      handleCancel: function () {
        this.modalOpen = false;
      },
      handleShowSelect: function () {
        this.modalOpen = true;

        this.fetchData({});
      },
      handleSwitchChange: function (e, value) {
        let { value: checked } = e;
        let { list, mode, required } = this;

        list = _.map(list, (item) => {
          if (String(item.value) == String(value)) {
            item = {
              id: item.id,
              // name: item.name,
              label: item.label,
              value: item.value,
              checked: checked
            }
          }
          if (checked && mode == "selector") {
            if (item.value != String(value)) {
              item.checked = false;
            }
          }

          return item;
        });

        if (required && _.every(list, (item) => item.checked == false)) {
          uni.showToast({
            icon: 'none',
            title: "必须至少要选择一项"
          });
          return;
        }

        this.list = list;
      },
      handleSearch: function(value) {
        this.page = 1;
        this.fetchData({page: this.page, query: value});
      },
      handleLoadmore: function () {
        this.page += 1;
        this.fetchData({page: this.page});
      },
      fetchData: function ({page, query}) {
        let { params } = this;
        let { klassName, perPage: per_page } = this;
        params = {
          ...params,
          per_page
        }

        this.status = "loading";

        this.requestApi({ klassName, page, query, params }).then((res) => {
          let {
            data: {
              data: {
                next_page, models
              }
            },
          } = res;

          if (next_page) {
            this.status = 'loadmore';
          } else {
            this.status = 'nomore';
          }
          let list = _.map(models, (item)=> {
            let { mode, selectedValue: value } = this;
            let checked = (mode == "selector") ? item.id == value?.value : (_.findIndex(value, (opt)=> opt.value == item.id) != -1);

            return ({
              id: item.id,
              // name: item.name,
              label: item.name,
              value: String(item.id),
              checked: checked
            })
          });

          if (page > 1) {
            this.list = _.concat(this.list, list);
          } else {
            this.list = _.uniqBy(_.concat(_.filter(this.list, "checked"), list), "id");
          }
        })
      },
      requestApi: function ({ klassName, query, page = 1, params = {per_page: 10} }) {
        let api;
        switch (klassName) {
          case 'User':
            api = userApi.simple({ query, page, ...params });
            return api;
          case 'Department':
            api = departmentApi.simple({ query, page, ...params });
            return api;
          case 'Lead':
            api = leadApi.simple({ query, page, ...params });
            return api;
          case 'Customer':
            api = customerApi.simple({ query, page, ...params });
            return api;
          case 'Contact':
            api = contactApi.simple({ query, page, ...params });
            return api;
          case 'Opportunity':
            api = opportunityApi.simple({ query, page, ...params });
            return api;
          case 'Contract':
            api = contractApi.simple({ query, page, ...params });
            return api;
          case 'ReceivedPaymentPlan':
            api = receivedPaymentPlanApi.simple({ query, page, ...params });
            return api;
          case 'Product':
            api = productApi.simple({ query, page, ...params });
            return api;
          case 'ProductCategory':
            api = productCategoryApi.simple({ query, page, ...params });
            return api;
          case 'CustomerCommonSetting':
            api = customerCommonSettingApi.simple({ query, page, ...params });
            return api;
        }
      }
    },
    computed: {
      valueDisplay: {
        get: function() {
          let { mode, selectedValue: value } = this;

          if (_.isNil(value)) return;

          return mode == "selector" ? value.label : _.map(value, "label").join(", ");
        },
        set: function (value) {
        }
      }
    },
    watch: {
      value(newVal) {
        if (!_.isEqual(newVal, this.selectedValue)) {
          this.selectedValue = newVal;
        }
      }
    }
  };
</script>

<style>
  .select2-container {
    width: 100%;
  }
</style>
