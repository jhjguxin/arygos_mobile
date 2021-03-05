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
        model = {}
      } = this.$attrs;
      let { start: startName, end: endName } = customField;
      let { [`${startName}`]: start, [`${endName}`]: end } = model;
      start = start || dayjs().format("YYYY-MM-DD");
      end = end || dayjs().format("YYYY-MM-DD");

      return {
        name,  fieldType, customField,
        startName,
        endName,
        start,
        end,
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
        let { startName, endName, start, end} = this;
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
          return;
        }
        if (key == "start" && _.isEmpty(end)) {
          this.selectEndShow = true;
          return;
        }

        this.$emit("fieldChange", {
          [`${startName}`]: this.start,
          [`${endName}`]: this.end,
        });
      }
    },
    computed: {
    }
  };
</script>

<style>
</style>
