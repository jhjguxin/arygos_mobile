<template>
  <u-cell-group>
    <u-cell-item title="是否显示非常用字段" :arrow="arrow" center hover-class="none">
      <template #icon><u-icon size="32" name="setting"></u-icon></template>
      <template #right-icon><u-switch v-model="collapsed" @change="handleSwitchClick"></u-switch></template>
    </u-cell-item>
  </u-cell-group>
</template>

<script>
  import _ from "lodash";
  
  export default {
  props: {
      klassName: { type: String, default: "" }
  },

    data() {
      /* moved to props */

      return {
        collapsed: false,
        arrow: false,
        size: 28,
      }
    },
    methods: {
      handleSwitchClick (value) {
        this.collapsed = value;
        this.$emit("change", value);
      }
    },
    computed: {
    }
  }
</script>

<style>
</style>
