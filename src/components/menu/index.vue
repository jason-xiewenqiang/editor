<template>
  <div >
    <ul id="contextMenu" class=" context-menu" ref="contextMenu">
      <li
        v-for="menu in menus"
        :key="menu.key"
        @click="handleClick(menu)"
      >
        <div class="img-box">
          <img :src="menu.icon"/>
        </div>
        <span>{{menu.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import eventBus from '@/util/busMgr';

export default {
  name: 'RightMenu',
  inject: ['getBusId', 'getProcess'],
  data() {
    return {
      sourceNode: null, // 触发菜单的节点
      menus: [
        { name: '任务', key: 'approver', icon: require('@/assets/picture/mession.png') },
        { name: '会签', key: 'countersign', icon: require('@/assets/picture/write.png') },
        { name: '分支', key: 'condition', icon: require('@/assets/picture/branch.png') },
        { name: '同步子流程', key: 'sync', icon: require('@/assets/picture/in.png') },
        { name: '异步子流程', key: 'async', icon: require('@/assets/picture/out.png') },
      ],
    };
  },
  created() {
    // 绑定并监听画布事件
    this.bindEvent();
  },
  methods: {
    bindEvent() {
      eventBus.$get(this.getBusId()).$on('contextmenuClick', e => {
        const menu = this.$refs.contextMenu || document.querySelector('contextMenu');
        if (menu) {
          menu.style.left = e.canvasX + 20 + 'px';
          menu.style.top = e.canvasY - 10 + 'px';
          menu.style.display = 'block';
        }
        // 保存当前点击的添加节点 -- 有用处
        this.sourceNode = e.item;
      });
      eventBus.$get(this.getBusId()).$on('mousedown', () => {
        const menu = this.$refs.contextMenu || document.querySelector('contextMenu');
        if (menu) {
          menu.style.display = 'none';
        }
      });
    },
    handleClick(item) {
      const menu = this.$refs.contextMenu || document.querySelector('contextMenu');
      if (menu) {
        menu.style.display = 'none';
      }
      this.addNode(item);
    },
    addNode(item) {
      this.getProcess().add(item, this.sourceNode);
    },
  },
};
</script>

<style lang="less" scoped>
.context-menu {
  position: absolute;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 5px 0;
  z-index: 1;
  display: none;
  width: 345px;
  padding-top: 10px;
  padding-left: 0;
}

.context-menu li {
  cursor: pointer;
  font-size: 12px;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  width: 150px;
  margin-left: 15px;
  margin-bottom: 10px;
  background-color: #f4f4f4;
  position: relative;
  box-sizing: border-box;
  padding-left: 48px;
  .img-box {
    width: 28px;
    height: 28px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #f8f8f8;
    left: 10px;
    top: 6px;
  }
  img {
    width: 16px;
    height: 16px;
    display: inline-block;
  }
}
.context-menu li:hover {
  background-color: #f5f7fa;
}
</style>
