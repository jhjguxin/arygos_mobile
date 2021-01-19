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

  export default {
    data() {

      return {
        klassName: "ScheduleReport",
        sortValue: "",
        order: "asc",
        sortOptions: [
          {
            value: "due_at", label: "日期", originLabel: "日期"
          },
        ],
        sortTitle: "排序",
        filterColumns: [
          {
            checked: true,
            custom_column_name: "cycle_type_display",
            field_type: "select_field",
            name: "cycle_type"
          },
          {
            checked: true,
            custom_column_name: "user.name",
            field_type: "select2_field",
            name: "user"
          }
        ],
        filtersModel: {} ,// 字段筛选初始值
        customFields: [
          {
            label: "类型",
            name: "cycle_type",
            originLabel: "类型",
            field_type: "select_field",
            collection_options: [
              ["日报", "daily"],
              ["周报", "weekly"],
              ["月报", "monthly"]
            ]
          },
          {
            label: "提交人",
            name: "user",
            originLabel: "提交人",
            field_type: "select2_field",
            select_klass_name: "User",
            input_html_options: {}
          },
        ]
      };
    },
    async mounted() {
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
