<template>
  <view>
      <u-cell-group
        :title="customFieldGroup.label"
        v-for="customFieldGroup in customFieldGroups"
        :key="customFieldGroup.id"
      >
        <u-cell-item
          :title="customField.label"
          :arrow="cellItem.arrow"
          :use-label-slot="cellItem.useLabelSlot"
          v-for="customField in customFieldGroup.custom_fields"
          :key="customField.name"
        >
          <view slot="label">
            <custom-field-on-show
              :customField="customField" :record="model"
            />
          </view>
        </u-cell-item>
      </u-cell-group>
      <u-loading mode="flower" v-if="customFieldGroups.length == 0"></u-loading>
  </view>
</template>

<script>
  import _ from 'lodash';
  import CustomFieldGroup from 'services/custom_field_group';

  export default {
    data() {
      let { klassName, model } = this.$attrs;

      return {
        klassName, model,
        customFieldGroups: [],
        cellItem: {
          arrow: false,
          useLabelSlot: true
        }
      };
    },
    async created() {
      let { klassName } = this;
      let customFieldGroups = await CustomFieldGroup.instance().fetchData(klassName);

      this.customFieldGroups = customFieldGroups;
    }
  }
</script>

<style>

</style>
