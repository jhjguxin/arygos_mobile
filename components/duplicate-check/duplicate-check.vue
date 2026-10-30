<template>
  <u-modal
    :title="title" :show="modalOpen" @update:show="modalOpen = $event" @confirm="handleConfirm"
    :width="width"
    v-if="duplicated"
  >
    <view class="wrap">
      <uni-list
        v-for="(value, key) in fields"
        v-bind:key="key"
       >
        <uni-list-item
          :title="value"
        ></uni-list-item>
      </uni-list>
    </view>
  </u-modal>
</template>

<script>
  import _ from "lodash";
  import {
    duplicateApi,
  } from "@/services/http";

  export default {
    data() {
      return {
        duplicated: false,
        modalOpen: false,
        title: "",
        fields: [],
        width: "80vw"
      };
    },
    methods: {
      check: function ({ model_klass, entity_hash, exclude_ids,
        lead_exclude_ids, customer_exclude_ids,
        contact_exclude_ids, callback
      }) {
        duplicateApi.check({
          model_klass, entity_hash, exclude_ids,
          lead_exclude_ids, customer_exclude_ids,
          contact_exclude_ids
        }).then((res)=> {
          let { data: {code, remark, data} } = res;

          if (Number(code) === 0) {
            callback();
          } else {
            this.title = remark;
            this.duplicated = true;
            this.modalOpen = true;
            this.fields = data;
          }
        });
      },
      handleConfirm: function () {
        let { duplicated, fields } = this;

        this.duplicated = false;
        this.modalOpen = false;

        this.$emit("confirm", {duplicated, fields});
      }
    }
  }
</script>

<style>
  .wrap {
    padding: 24rpx;
  }
</style>

