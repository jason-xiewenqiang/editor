<template>
  <section>
    <el-form label-position="left" label-width="80px">
      <template v-for="btn in list">
        <el-form-item :label="smap[btn.id]" :key="btn.id" required="">
          <el-input size="small" placeholder="请输入" v-model="btn.name"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </section>
</template>

<script>
import BaseConfig from '../../BaseConfig';

export default {
  name: 'EditBtnName',
  props: ['data'],
  data() {
    return {
      list: [],
      smap: {
        CHANGE: '转办操作',
        SAVE: '保存操作',
        BACKOUT: '撤销操作',
        REJECT: '驳回操作',
        EXECUTE: '提交操作',
        AGREE: '同意操作',
        DISAGREE: '反对操作',
      },
    };
  },
  mounted() {
    this.list = this.getList();
  },
  methods: {
    getValue() {
      return this.list;
    },
    getList() {
      const {
        type, base, reject, countersign,
      } = this.data;
      switch (type) {
        case BaseConfig.property.start.key:
          return [base[0], base[1], base[3]];
        case BaseConfig.property.approver.key:
          return [...base, ...reject];
        case BaseConfig.property.countersign.key:
          return [...countersign];
        default:
          return [];
      }
    },
  },
};
</script>

<style scoped lang="less">
section {
  box-sizing: border-box;
  padding: 0 30px;
}
</style>
