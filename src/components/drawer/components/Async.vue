<template>
  <div class="async-container">
    <div class="title">参数</div>
    <div class="select-param">
      <label for="">关联流程</label>
      <el-select v-model="value" placeholder="请选择子流程" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Async',
  props: {
    model: {
      default: null,
    },
  },
  data() {
    return {
      options: [],
      value: '',
    };
  },
  watch: {
    model(val) {
      if (val) {
        this.value = val.processId;
      }
    },
  },
  created() {
    this.options = this.$store.state.process.subProcess.filter(opt => opt.resourceId !== this.model.resourceId).map(opt => ({ label: opt.name, value: opt.resourceId }));
  },
  mounted() {
    this.value = this.model.processId;
  },
  methods: {
    getValue() {
      return this.value;
    },
  },
};
</script>

<style lang="less" scoped>
.async-container {
  padding: 10px 15px 20px 25px;
  border-bottom: 1px solid #ccc;
  .title {
    margin-bottom: 15px;
  }
  /deep/ .el-select {
    margin-left: 20px;
  }
}
</style>
