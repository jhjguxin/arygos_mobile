<template>
  <u-row gutter="16">
    <u-col span="12">
      <u-search
        :placeholder="uSearch.placeholder" v-model="uSearch.query"
        @search="handleSearch"
      ></u-search>
    </u-col>
    <u-col span="12">
      <scroll-view scroll-y class="wrap" style="height: 80vh;">
        <uni-list
          v-for="item in list"
          v-bind:key="item.value"
         >
          <uni-list-item
            :title="item.label"
            clickable
            @click="handleListItemClick($event, item)"
          ></uni-list-item>
        </uni-list>
        <u-loadmore :status="uLoadmore.status" @loadmore="handleLoadmore"/>
      </scroll-view>
    </u-col>
  </u-row>
</template>

<script>
  import _ from "lodash";
  import {
    leadApi,
    customerApi,
    opportunityApi,
    contractApi
  } from "services/http";

  export default {
    data() {
      let { klassName } = this.$attrs;

      return {
        klassName: klassName,
        page: 1,
        uSearch: {
          query: null,
          placeholder: "请输入搜索内容",
        },
        list: [],
        uLoadmore: {
           status: "nomore"
        }
      };
    },
    methods: {
      handleListItemClick: function (e, item) {
        let { klassName } = this;
        let { id } = item;

        this.$emit("select", {klassName, id});
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
        let { klassName, perPage: per_page, params } = this;
        params = {
          ...params,
          per_page
        }
      
        this.uLoadmore.status = "loading";
      
        this.requestApi({ klassName, page, query, params }).then((res) => {
          let {
            data: {
              data: {
                next_page, models
              }
            },
          } = res;
      
          if (next_page) {
            this.uLoadmore.status = 'loadmore';
          } else {
            this.uLoadmore.status = 'nomore';
          }
          let list = _.map(models, (item)=> {
            let { mode, value } = this;
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
            this.$set(this, "list", _.concat(this.list, list));
          } else {
            this.$set(this, "list", list);
          }
        })
      },
      requestApi: function ({ klassName, query, page = 1, params = {per_page: 10} }) {
        let api;
        switch (klassName) {
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
        }
      }
    }
  }
</script>

<style>

</style>
