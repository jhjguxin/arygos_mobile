<template>
  <u-row gutter="16" justify="space-between">
    <u-col span="2">{{customField.label}}</u-col>
    <u-col span="4">
      <u-form-item :prop="startName">
        <u-input
          :border="border" v-model="start"
          placeholder="开始" @click="selectStartShow = true"></u-input>
        <u-datetime-picker style="flex:none" :show="selectStartShow" mode="datetime" :modelValue="start" @confirm="handleConfirm($event, 'start')" @close="selectStartShow = false" @cancel="selectStartShow = false"></u-datetime-picker>
      </u-form-item>
    </u-col>
    -
    <u-col span="4">
      <u-form-item :prop="endName">
        <u-input
          :border="border" v-model="end"
          placeholder="结束" @click="selectEndShow = true"></u-input>
        <u-datetime-picker style="flex:none" :show="selectEndShow" mode="datetime" :modelValue="end" @confirm="handleConfirm($event, 'end')" @close="selectEndShow = false" @cancel="selectEndShow = false"></u-datetime-picker>
      </u-form-item>
    </u-col>
  </u-row>

</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { ref } from 'vue';

  export default {
  props: {
      name: "",
      fieldType: "",
      customField: { },
      record: { },
      klassName: "",
      value: { }
  },

    setup(props) {
      const start = ref("");
      const end = ref("");
      const selectStartShow = ref(false);
      const selectEndShow = ref(false);
      return {
        startName: `${props.customField.name}-start`,
        endName: `${props.customField.name}-end`,
        start,
        end,
        border: "none",
        selectStartShow,
        selectEndShow
      };
    },
    methods: {
      handleConfirm: function (e, key) {
        let { [`${key}Name`]: name, start, end} = this;
        let value = dayjs(Number(e.value)).format("YYYY-MM-DD HH:mm:ss");
        let showKey = key == "start" ? "selectStartShow" : "selectEndShow";

        if (key == "start" && end) {
          if (dayjs(value) > dayjs(end)) {
            uni.showToast({
              icon: 'none',
              title: "开始时间不能大于结束时间",
              duration: 1000
            });
            this[showKey] = false;
            _.delay(()=> {
              this[showKey] = true;
            }, 500);
            return;
          }
        }
        if (key == "end" && start) {
          if (dayjs(start) > dayjs(value)) {
            uni.showToast({
              icon: 'none',
              title: "开始时间不能大于结束时间",
              duration: 1000
            });
            this[showKey] = false;
            _.delay(()=> {
              this[showKey] = true;
            }, 500);
            return;
          }
        }
        this[key] = value;
        this[showKey] = false;

        if (key == "end" && _.isEmpty(start)) {
          this.selectStartShow = true;

          this.$emit("fieldChange", {name, value});
          return;
        }
        if (key == "start" && _.isEmpty(end)) {
          this.selectEndShow = true;

          this.$emit("fieldChange", {name, value});
          return;
        }

        this.$emit("fieldChange", {name, value});
      }
    },
    computed: {
    }
  };
</script>

<style>
</style>
