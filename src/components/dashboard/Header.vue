<template>
  <div class="header">
    <span class="collpase-icon" @click="switchCollpase">
      <i v-if="isCollpase" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </span>
    <div class="status-box">
      <span class="s-icon">
        <i class="el-icon-search"></i>
      </span>
      <span class="s-icon">
        <i class="el-icon-message-solid"></i>
      </span>
      <span class="s-icon">
        <i class="el-icon-user-solid"></i>
        <span>admin</span>
        <i class="el-icon-arrow-down ft14"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyHeader',
  props: ['collpase'],
  data() {
    return {
      isCollpase: false,
    };
  },
  mounted() {
    this.isCollpase = this.collpase;
  },
  methods: {
    switchCollpase() {
      this.isCollpase = !this.isCollpase;
      this.$emit('collpase-change', this.isCollpase);
    },
  },
};
</script>

<style scoped lang="less">
.header {
  line-height: 60px;
  height: 60px;
  background-color: #fff;
  box-sizing: border-box;
  border: 1px solid #eee;
  .collpase-icon {
    margin-left: 20px;
    font-size: 32px;
    cursor: pointer;
    color: #666;
  }
  .status-box {
    float: right;
    width: 50%;
    height: 100%;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
    .s-icon {
      margin-right: 25px;
      i {
        font-size: 22px;
      }
      > span {
        margin: 0 8px 0 12px;
      }
      .ft14 {
        font-size: 14px;
      }
    }
  }
}
</style>
