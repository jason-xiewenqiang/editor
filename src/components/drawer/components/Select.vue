<template>
  <section class="select-member">
    <section class="left-tree">
      <div class="title">选择：</div>
      <person-select :defaultCheck="computeSelect" :isGetUser="data.specify === '0'" ref="select" @change="changeHandler" v-if="showPersonSelect"/>
      <SelectRole v-if="data.specify === '2'" :defaultCheck="computeSelect" @change="changeHandler"/>
    </section>
    <section class="right-selected">
      <div class="title">已选：</div>
      <div class="select-list">
        <SelectItem v-for="item in selected" :item="item" :key="item.name||item.key" @remove="removeItem(item)"/>
      </div>
    </section>
  </section>
</template>

<script>
import PersonSelect from '@/pages/common/PersonSelect';
import SelectItem from './selectedItem';
import SelectRole from './Role';

export default {
  name: 'SelectMember',
  props: {
    data: {
      type: Object,
    },
  },
  components: {
    PersonSelect,
    SelectItem,
    SelectRole,
  },
  data() {
    return {
      selected: [],
    };
  },
  mounted() {
    this.selected = this.data.member;
  },
  computed: {
    computeSelect() {
      return this.selected.map(item => item.uid);
    },
    showPersonSelect() {
      return this.data.specify === '0' || this.data.specify === '1';
    },
  },
  methods: {
    changeHandler(ev = []) {
      const duplicateArray = [];
      const keyMap = {};
      ev.forEach(element => {
        if (!keyMap[element.uid] || !keyMap[element.key]) {
          duplicateArray.push(element);
          if (element.key) {
            keyMap[element.key] = 1;
          } else {
            keyMap[element.uid] = 1;
          }
        }
      });
      this.selected = duplicateArray;
    },
    removeItem(item) {
      const index = this.selected.findIndex(select => select.uid === item.uid);
      this.selected.splice(index, 1);
      this.selected = [...this.selected];
    },
    getValue() {
      return this.selected;
    },
  },
};
</script>

<style lang="less" scoped>
.select-member {
  display: flex;
  justify-content: space-between;
  height: 375px;
  padding: 0 20px;
  box-sizing: border-box;
  .left-tree {
    .title {
      height: 32px;
      line-height: 32px;
    }
    width: 49%;
    height: calc(100% - 32px);
  }
  .right-selected {
    .title {
      height: 32px;
      line-height: 32px;
    }
    width: 49%;
    .select-list {
      box-sizing: border-box;
      height: 100%;
      padding: 10px;
      background: #f2f2f2;
      border-radius: 5px;
      height: calc(100% - 32px);
      overflow-y: auto;
    }
  }
}
</style>
