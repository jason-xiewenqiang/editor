<template>
  <div class="menu" v-show="show" :style="{left: x + 'px', top: y + 'px'}">
    <ul>
      <li v-for="menu in menus" :key="menu.key" @click="menuClick(menu)"> {{menu.name}} </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    x: {
      default: 100,
      type: Number,
    },
    y: {
      default: 100,
      type: Number,
    },
    ee: {
      default: null,
      type: Object,
    },
  },
  setup(props, context) {
    console.log(props, context);
  },
  data() {
    return {
      menus: [
        { name: '任务节点', key: 'user' },
        { name: '分支节点', key: 'branch' },
        { name: '会签节点', key: 'countersign' },
        { name: '子流程节点', key: 'sub-process' },
      ],
    };
  },
  methods: {
    menuClick(menu: object) {
      console.log(menu);
      (this.ee as any).emit('menu-click', menu);
    },
  },
});
</script>
<style lang="less" scoped>
.menu {
  position: absolute;
  z-index: 2;
  padding: 10px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  color: #000;
  border-radius: 8px;
  ul {
    margin: 0;
    padding: 0;
    li {
      height: 50px;
      line-height: 50px;
      list-style: none;
      text-indent: 15px;
      &:hover {
        background-color: antiquewhite;
        cursor: pointer;
      }
    }
  }
}
</style>
