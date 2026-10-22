<template>
  <view class="entity-base-info" :style="style">
    <u-cell-group
      :title="customFieldGroup.label"
      v-for="customFieldGroup in customFieldGroups"
      :key="customFieldGroup.id"
    >
      <u-cell
        :title="customField.label"
        :arrow="cellItem.arrow"
        :use-label-slot="cellItem.useLabelSlot"
        :title-style="cellItem.titleStyle"
        v-for="customField in customFieldGroup.custom_fields"
        :key="customField.name"
      >
        <template #label><view >
          <custom-field-on-show
            :customField="customField" :record="model"
          />
        </view></template>
      </u-cell>
    </u-cell-group>
    <u-loading-icon mode="spinner" v-if="customFieldGroups.length == 0" />
  </view>
</template>

<script>
  import _ from 'lodash';
  import CustomFieldGroup from '@/services/custom_field_group';

  export default {
  props: {
      klassName: "",
      style: { type: String, default: "height: 55vh;" },
      model: { }
  },

    data() {
      /* moved to props */

      return {
        customFieldGroups: [],
        cellItem: {
          arrow: false,
          useLabelSlot: true,
          titleStyle: {'font-size': '24rpx'}
        }
      };
    },
    async created() {
      let { klassName } = this;
      let customFieldGroups = await CustomFieldGroup.instance().fetchData(klassName);

      this.customFieldGroups = customFieldGroups;
    },
    computed: {
      model: {
        get() {
          /* moved to props */

          return model;
        },
        set (value) {
          return value
        }
      }
    }
  }
</script>

<style>
  .entity-base-info {
    overflow-y: scroll;
  }
</style>
