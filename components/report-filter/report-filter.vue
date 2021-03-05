<template>
  <view class="filter">
    <u-dropdown ref="uDropdown">
      <u-dropdown-item title="条件过滤">
        <view class="slot-content u-cell-item-box">
          <report-filter-form
            :filterColumns="filterColumns" :filters="filters"
            @filterConfirm="handleFilterConfirm"
          />
        </view>
      </u-dropdown-item>
    </u-dropdown>
  </view>
</template>

<script>
  export default {
    data() {
      let {
        filters = {},
        filterColumns = {}
      } = this.$attrs;

      return {
        filterColumns,
        filters
      };
    },
    methods: {
      handleFilterConfirm(filters){
        this.$emit("filterConfirm", filters);
        this.$refs.uDropdown.close();
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
