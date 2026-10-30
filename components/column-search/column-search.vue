<template>
  <u-row gutter="16" justify="center" v-if="list.length > 0">
    <u-col span="4">
      <u-select
        :options="list"
        v-model:current="searchColumnName"
        label-name="label"
        key-name="value"
        label="选择搜索字段"
        border
        :show-options-label="true"
        @select="handleSelectChange"
      />
    </u-col>
    <u-col span="8">
      <u-search
        :placeholder="search.placeholder" v-model="query"
        :show-action="search.showAction"
        :clearable="search.clearable"
        @search="handleSearch"
        @clear="handleSearch"
      ></u-search>
    </u-col>
  </u-row>
</template>

<script>
  import _ from 'lodash';
  import { userSettingApi } from '@/services/http';


  export default {
  props: {
      klassName: { type: String }
  },

    data() {
      return {
        query: null,
        search: {
          placeholder: "输入搜索内容",
          showAction: false,
          clearable: true
        },
        searchColumnName: null,
        list: []
      };
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData () {
        /* moved to props */
        userSettingApi.default_entity_list_table({ klass_name: this.klassName }).then((res) => {
          let { data: {code, remark, data}} = res;

          if (code == 0) {
            let { search_columns } = data;
            let list = _.map(search_columns, (column) => {
              let { name: value, label , custom_column_name: customColumnName } = column;

              return {value, label, customColumnName};
            });

            this.query = null;
            this.searchColumnName = list[0]?.value;
            this.search.placeholder = `搜索${list[0]?.label}`;
            this.list = list;
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            })
          }
        })
      },
      handleSelectChange (item) {
        this.query = null;
        this.search.placeholder = `搜索${item.label}`;
      },
      handleSearch (value) {
        let { searchColumnName } = this;
        this.query = value;

        this.$emit("search", {
          query: value,
          searchColumnName
        })
      }
    }
  }
</script>

<style>
</style>
