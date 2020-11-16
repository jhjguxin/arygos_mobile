<template>
  <u-row gutter="16" justify="center">
    <u-col span="4">
      <u-input
        :border="columnSelect.border" type="select" :select-open="selectShow" v-model="valueDisplay"
        :placeholder="columnSelect.placeholder" @click="selectShow = true"></u-input>
      <u-select mode="single-column" :list="list" v-model="selectShow" @confirm="handleSelectConfirm"></u-select>
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
  import _ from "lodash";
  import { userSettingApi } from 'services/http';


	export default {
		data() {
			return {
        query: null,
        selectShow: false,
        columnSelect: {
          placeholder: "选择搜索字段",
          border: true
        },
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
        let { klassName: klass_name } = this.$attrs;
        userSettingApi.default_entity_list_table({ klass_name}).then((res) => {
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
            this.$set(this, "list", list);
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            })
          }
        })
      },
      handleSelectConfirm (value) {
        this.query = null;
        this.searchColumnName = value[0]?.value;
        this.search.placeholder = `搜索${value[0]?.label}`;
      },
      handleSearch (value) {
        let { searchColumnName } = this;
        this.query = value;
        
        this.$emit("search", {
          query: value,
          searchColumnName
        })
      }
    },
    computed: {
      valueDisplay: {
        get: function () {
          let { list, searchColumnName: value } = this;

          return _.find(list, (opt)=> opt.value == value)?.label;
        },
        set: function (value) {
        }
      }
    }
	}
</script>

<style>
</style>
