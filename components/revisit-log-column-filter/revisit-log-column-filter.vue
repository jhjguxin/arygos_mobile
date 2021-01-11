<template>
  <view class="filter">
    <u-dropdown ref="uDropdown" @open="handleOpen">
      <u-dropdown-item title="字段筛选">
        <view class="slot-content u-cell-item-box">
          <column-filter-form
            :klassName="klassName"
            @filterConfirm="handleFilterConfirm"
            :model="filtersModel"
            :customFields="customFields"
            :filterColumns="filterColumns"
            v-if="customFields.length > 0"
          />
        </view>
      </u-dropdown-item>
      <u-dropdown-item
        v-model="sortValue" :title="sortTitle" :options="sortOptions" @change="handleSortDropDownChange"
      ></u-dropdown-item>
    </u-dropdown>
  </view>
</template>

<script>
  import _ from "lodash";
  import CustomField from 'services/custom_field';
  import { userSettingApi } from 'services/http';

  export default {
    data() {
      let { storeKey } = this.$attrs;

      return {
        klassName: "RevisitLog",
        storeKey,
        sortValue: "",
        order: "asc",
        sortOptions: [
          {
            value: "created_at", label: "创建时间", originLabel: "创建时间"
          },
          {
            value: "revisit_at", label: "跟进时间", originLabel: "跟进时间"
          }
        ],
        sortTitle: "排序",
        filterColumns: [
          {
            checked: true,
            custom_column_name: "created_at",
            field_type: "datetime_field",
            name: "created_at"
          },
          {
            checked: true,
            custom_column_name: "revisit_at",
            field_type: "datetime_field",
            name: "revisit_at"
          },
          {
            checked: true,
            custom_column_name: "category_display",
            field_type: "field_map_field",
            name: "category"
          }
        ],
        filtersModel: {} ,// 字段筛选初始值
        customFields: []
      };
    },
    async mounted() {
      let { klassName, storeKey } = this;

      CustomField.instance().fetchData(klassName).then((customFields)=> {
        this.$set(this, "customFields", customFields);
      });
    },
    methods: {
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
