<template>
  <section class="selected-item" v-if="item">
    <el-avatar size="small" :src="icon" shape="square"></el-avatar>
    <span class="name">{{item.name||item.label}}</span>
    <i class="close-btn el-icon-circle-close" @click="del"></i>
  </section>
</template>

<script>
export default {
  name: 'SelectedItem',
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      icon: require('@/assets/picture/white.png'),
    };
  },
  methods: {
    del() {
      this.$emit('remove');
    },
  },
};
</script>

<style lang="less" scoped>
.selected-item {
  height: 32px;
  line-height: 32px;
  position: relative;
  display: block;
  box-sizing: border-box;
  padding: 0 5px;
  /deep/ .el-avatar {
    padding: 4px;
  }
  /deep/ .el-avatar--square {
    vertical-align: middle;
  }
  .name {
    display: inline-block;
    position: relative;
    top: 1px;
    margin-left: 8px;
  }
  .close-btn {
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 8px;
    font-size: 16px;
    &:hover {
      color: #ffffff;
    }
  }
}
.selected-item:hover {
  background-color: #e2e2e2;
  cursor: pointer;
}
</style>
