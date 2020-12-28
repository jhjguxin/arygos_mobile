<template>
  <u-cell-group>
    <u-cell-item title="是否显示非常用字段" :arrow="arrow" center hover-class="none">
      <u-icon slot="icon" size="32" name="setting"></u-icon>
      <u-switch slot="right-icon" v-model="collapsed" @change="handleSwitchClick"></u-switch>
    </u-cell-item>
  </u-cell-group>
</template>

<script>
  import _ from "lodash";
  
  export default {
    data() {
      let {
        klassName = "",
      } = this.$attrs;

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
