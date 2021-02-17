<template>
  <div class="select-role">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAll">全选</el-checkbox>
    <div style="margin: 10px 0;"></div>
    <el-checkbox-group v-model="checkedList" @change="handleChecked">
      <el-checkbox v-for="item in options" :key="item.uid" :label="item.uid" :value="item.uid">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'SelectRole',
  props: {
    defaultCheck: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkAll: false,
      checkedList: [],
      isIndeterminate: false,
      options: [],
      showList: true,
    };
  },
  watch: {
    defaultCheck(val) {
      if (val && val.length) {
        this.checkedList = [...this.defaultCheck];
        this.isIndeterminate = (this.defaultCheck.length > 0) && (this.defaultCheck.length < this.options.length);
        this.checkAll = this.checkedList.length === this.options.length;
      }
    },
  },
  created() {
    this.formatSelectOptions();
  },
  mounted() {
    this.checkedList = [...this.defaultCheck];
    this.isIndeterminate = (this.defaultCheck.length > 0) && (this.defaultCheck.length < this.options.length);
    this.checkAll = this.checkedList.length === this.options.length;
  },
  methods: {
    handleCheckAll(val) {
      this.checkedList = val ? [...this.options.map(opt => opt.uid)] : [];
      this.$emit('change', val ? this.options : []);
      this.isIndeterminate = false;
    },
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.options.length;
      this.isIndeterminate = (checkedCount > 0) && (checkedCount < this.options.length);
      this.$emit('change', this.$store.state.process.roleList.filter(opt => this.checkedList.includes(opt.uid)));
    },
    formatSelectOptions() {
      this.options = this.$store.state.process.roleList.map(role => ({ uid: role.uid, label: role.name }));
    },
  },
};
</script>

<style lang="less" scoped>
.select-role {
  height: 100%;
  width: 100%;
  background-color: #f2f2f2;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  /deep/ .el-checkbox {
    margin-bottom: 5px;
  }
}
</style>
