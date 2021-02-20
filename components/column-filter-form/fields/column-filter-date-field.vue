<template>
  <u-row gutter="16" justify="space-between">
    <u-col span="2">{{customField.label}}</u-col>
    <u-col span="4">
      <u-form-item :prop="startName">
        <u-input
          :border="border" v-model="start"
          placeholder="开始" @click="selectStartShow = true"></u-input>
        <u-picker v-model="selectStartShow" mode="time" :default-time="start" :params="params" @confirm="handleConfirm($event, 'start')"></u-picker>
      </u-form-item>
    </u-col>
    -
    <u-col span="4">
      <u-form-item :prop="endName">
        <u-input
          :border="border" v-model="end"
          placeholder="结束" @click="selectEndShow = true"></u-input>
        <u-picker v-model="selectEndShow" mode="time" :default-time="end" :params="params" @confirm="handleConfirm($event, 'end')"></u-picker>
      </u-form-item>
    </u-col>
  </u-row>
</template>

<script>
  import _ from "lodash";
  import dayjs from 'dayjs';

  export default {
    data() {
      // props 获取数据
      let {
        name,  fieldType, customField,
        record, klassName,
        value = {}
      } = this.$attrs;
      let { start, end} = value;

      return {
        name,  fieldType, customField,
        record, klassName,
        value,
        startName: `${customField.name}-start`,
        endName: `${customField.name}-end`,
        start: "",
        end: "",
        params: {
          year: true,
          month: true,
          day: true,
          hour: false,
          minute: false,
          second: false
        },
        border: false,
        selectStartShow: false,
        selectEndShow: false
      }
    },
    methods: {
      handleConfirm: function (e, key) {
        let { [`${key}Name`]: name, start, end} = this;
        let value = `${e.year}-${e.month}-${e.day}`;
        
        if (key == "start" && end) {
          if (dayjs(value) > dayjs(end)) {
            uni.showToast({
              icon: 'none',
              title: "开始时间不能大于结束时间",
              duration: 1000
            });
            _.delay(()=> {
              this.selectStartShow = true;
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
            _.delay(()=> {
              this.selectEndShow = true;
            }, 500);
            return;
          }
        }
        this.$set(this, key, value);
        
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
