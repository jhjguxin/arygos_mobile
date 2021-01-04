<template>
  <view class="filter">
    <u-dropdown ref="uDropdown" @open="handleOpen">
      <u-dropdown-item title="字段筛选">
        <view class="slot-content u-cell-item-box">
          <column-filter-form
            :klassName="klassName"
            @filterConfirm="handleFilterConfirm"
            :model="filtersModel"
            :filterColumns="filterColumns"
            v-show="filterColumns.length > 0"
          />
          <u-empty text="筛选条件为空" mode="list" v-show="filterColumns.length == 0"/>
        </view>
      </u-dropdown-item>
      <u-dropdown-item
        v-model="sortValue" :title="sortTitle" :options="sortOptions" @change="handleSortDropDownChange"
      ></u-dropdown-item>
      <u-dropdown-item title="筛选设置">
        <view class="slot-content u-cell-item-box">
          <uni-list
            v-for="item in defaultFilterColumns"
            v-bind:key="item.name"
           >
            <uni-list-item
              :title="item.label"
              showSwitch
              :switchChecked="item.checked"
              @switchChange="handleFilterColumnSwitchChange($event, item.name)"
            ></uni-list-item>
          </uni-list>
        </view>
      </u-dropdown-item>
    </u-dropdown>
  </view>
</template>

<script>
  import _ from 'lodash';
  import { userSettingApi } from 'services/http';
    
  export default {
    data() {
      let { klassName, storeKey } = this.$attrs;
      storeKey = storeKey || klassName;

      return {
        klassName,
        storeKey,
        sortValue: "",
        order: "asc",
        sortOptions: [],
        defaultFilterColumns: [],
        maxFilterColumn: 6,
        sortTitle: "排序",
        filterColumns: [],
        filtersModel: {} // 字段筛选初始值
      };
    },
    mounted() {
      let { storeKey } = this;
      this.filterColumns = this.$store.getters.getFilterColumns(storeKey) || [];

      this.fetchData();
    },
    methods: {
      fetchData () {
        let { sortValue, order, filterColumns } = this;
        let { klassName: klass_name } = this.$attrs;
        userSettingApi.default_entity_list_table({ klass_name}).then((res) => {
          let { data: {code, remark, data}} = res;
          
          if (code == 0) {
            let { sort_columns, filter_columns } = data;
            let sortOptions = _.map(sort_columns, (column) => {
              let { name: value, label } = column;
              return {value, label, originLabel: label};
            });
            let defaultFilterColumns = _.map(filter_columns, (column) => {
              let checked = _.findIndex(filterColumns, (_column) => _column.name == column.name) > -1;
              return {
                ...column,
                checked
              }
            });

            this.$set(this, "defaultFilterColumns", defaultFilterColumns);
            this.$set(this, "sortOptions", sortOptions);
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            })
          }
        })
      },
      handleSortDropDownChange (value) {
        let { sortValue, order, sortOptions } = this;
        if (sortValue === value) {

          order = order === "asc" ? "desc" : "asc";
        } else {
          order = "asc";
        }

        let _order = order === "asc" ? "▲" : "▼";

        sortOptions = _.map(sortOptions, (option) => {
          let { originLabel: label } = option;
          option.label = option.value == value ? `${label}  ${_order}` : label;
          return option;
        });
        let sortTitle = _.find(sortOptions, (option)=> (option.value == value))?.label;
        
        this.sortOptions = sortOptions;
        this.sortValue = value;
        this.order = order;
        this.sortTitle = sortTitle;

        let sort = [{[`${value}`]: order}];
        this.$emit("sortColumnChange", sort);
      },
      handleFilterColumnSwitchChange (e, value) {
        let { klassName } = this.$attrs;
        let { value: checked } = e;
        let { defaultFilterColumns, maxFilterColumn, storeKey } = this;
        
        defaultFilterColumns = _.map(defaultFilterColumns, (column) => {
          if (String(column.name) == String(value)) {
            column = {
              ...column,
              checked: checked
            }
          }

          return column;
        });
        this.defaultFilterColumns = defaultFilterColumns;
                
        if (checked && _.filter(defaultFilterColumns, "checked").length > maxFilterColumn) {
          uni.showToast({
            icon: 'none',
            title: `最多启用${maxFilterColumn}个字段`,
            duration: 1000,
          });

          _.delay(() => {
            defaultFilterColumns = _.map(defaultFilterColumns, (column) => {
              if (String(column.name) == String(value)) {
                column = {
                  ...column,
                  checked: false
                }
              }
            
              return column;
            });
            
            this.defaultFilterColumns = defaultFilterColumns;
          }, 100);
          return;
        }
        
        let columns = _.filter(defaultFilterColumns, "checked").map((column) => ({...column}));
        this.$store.dispatch('setFilterColumns', {name: storeKey, columns});
        this.filterColumns = columns;
      },
      handleFilterConfirm (filters, model) {
        this.$emit("filterConfirm", filters);

        // REVIEW 下拉菜单收起会销毁筛选组件
        this.filtersModel = model;
        this.$refs.uDropdown.close();
      },
      handleOpen () {
        // console.log(this.filtersModel)
      }
    }
  }
</script>

<style>
  .slot-content {
    background-color: #FFFFFF;
    padding: 24rpx;
    
    .item-box {
      margin-bottom: 50rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      
      .item {
        border: 1px solid $u-type-primary;
        color: $u-type-primary;
        padding: 8rpx 40rpx;
        border-radius: 100rpx;
        margin-top: 30rpx;
      }
      
      .active {
        color: #FFFFFF;
        background-color: $u-type-primary;
      }
    }
  }
  .u-cell-item-box {
    max-height: 70vh;
    overflow-y: scroll;
  }
</style>
