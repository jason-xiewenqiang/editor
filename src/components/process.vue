<template>
  <div class="x-process-editor">
    <div class="zoom-box">
      <!-- <el-button type="default" @click="downloadImage" size="small">导出图片</el-button> -->
      <el-button type="default" @click="zoomOut" size="small" icon="el-icon-minus"></el-button>
      <span>{{zoom}}%</span>
      <el-button type="default" @click="zoomIn" size="small" icon="el-icon-plus"></el-button>
    </div>
    <section id="process-box" ref="process-box"></section>
    <el-drawer
      size="525px"
      :visible.sync="drawer"
      :with-header="false"
      :before-close="beforeClose"
      direction="rtl"
      @close="drawerClose">
      <Drawer :drawer="drawer" ref="drawer" :node="currentItem" @close="drawerClose" @save="saveNode"/>
    </el-drawer>
    <Menu/>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import uuid from '@/util/uuid';
import { deepClone } from '@/util/tool';
import EventBus from '@/util/busMgr';
import { mapActions } from 'vuex';
import Process from './@lib/process';
import registryNode from './@nodes';
import registryBehavior from './@behavior';
import Drawer from './drawer/index';
import Menu from './menu/index';
import BaseConfig from './BaseConfig';
import registryEdge from './@edges';
import { getDefaultView } from './@lib/renderHelper';
import { combinateNodes } from './@lib/collectHelper';
import { formatFetchData } from './@lib/createHelper';

export default {
  name: 'ProcessEditor',
  props: {
    // 当前编辑器的状态 edit runtime
    action: {
      default: 'edit',
      type: String,
    },
  },
  provide() {
    return {
      getBusId: () => this.busId, // 当前唯一事件发射器 id
      getProcess: () => this.processInstance, // 画布实例
      getStartId: () => this.startNodeId, // 开始节点 id
      getEndId: () => this.endNodeId, // 结束节点 id
      getCurrentItem: () => this.currentItem, // 当前 选中的 active 节点
    };
  },
  components: { Drawer, Menu },
  data() {
    return {
      busId: uuid(), // eventBus id
      processInstance: null, // 流程实例
      drawer: false, // 弹窗打开
      zoom: 100, // 缩放
      continerWidth: 0, // 容器宽
      continerHeight: 0, // 容器高
      canvasWidth: 0, // 画布宽
      canvasHeight: 0, // 画布高
      referencePoint: { x: 0, y: 0 }, // 起始参考点
      startNodeId: null, // 开始节点的 node -> id
      endNodeId: null, // 流程结束节点的 node -> id
      currentItem: null, // 当前选中的节点
    };
  },
  mounted() {
    // TODO: 初始化的处理 - 如果是小屏幕 那么要动态计算位置进行 graph 平移
    this.$nextTick(() => {
      const boxRect = this.$refs['process-box'].getBoundingClientRect();
      this.continerWidth = boxRect.width;
      this.continerHeight = boxRect.height;
      this.canvasWidth = boxRect.width;
      this.canvasHeight = boxRect.height * 8;
      this.referencePoint.x = this.continerWidth / 4;
      this.referencePoint.y = 30;
      registryNode(); // 注册节点
      registryEdge(); // 注册连线
      registryBehavior(); // 注册行为
      this.initGraph();
      this.controlDrawer.call(this); // 打开属性面板绑定
      this.adjustZIndex(); // 因为父级的定位关系 这里的网格需要进行 index 处理
    });
  },
  methods: {
    // 初始化画布
    initGraph() {
      const grid = new G6.Grid();
      const graph = new G6.Graph({
        container: 'process-box',
        width: this.canvasWidth,
        height: this.canvasHeight,
        modes: {
          default: [
            'click-select',
            'hover-node',
            // 'drag-node',
            'drag-canvas',
          ],
        },
        plugins: [grid],
      });
      // 记录起始点的信息
      graph.referencePoint = this.referencePoint;
      this.processInstance = new Process(graph, this.busId);
      const data = this.preload(graph) || getDefaultView(this.referencePoint, graph);
      graph.data(data);
      graph.render();
      this.commit(false); // 同步一次
    },
    // 预加载内容
    preload(graph) {
      if (this.$store.state.designerStore.process) {
        if (typeof this.$store.state.designerStore.process.origin === 'string') {
          const data = formatFetchData(this.$store.state.designerStore.process.origin, graph);
          return data;
        }
        return formatFetchData(this.$store.state.designerStore.process.origin, graph);
      }
      return null;
    },
    // 图层的层级显示需要调整
    adjustZIndex() {
      setTimeout(() => {
        const gridBox = document.querySelector('.g6-grid-container');
        const canvas = document.querySelector('canvas');
        gridBox.style.zIndex = 0;
        canvas.style.position = 'absolute';
        canvas.style.zIndex = 1;
      }, 200);
    },
    // 控制抽屉
    controlDrawer() {
      const bus = EventBus.$get(this.busId);
      bus.$on('drawer.open', (event) => {
        this.currentItem = event;
        this.drawer = true;
      });
      bus.$on('draw.close', () => {
        this.currentItem = null;
        this.drawer = false;
      });
      bus.$on('commit', () => {
        this.commit();
      });
      this.$once('hook:beforeDestroy', () => {
        bus.$off(this.busId);
      });
    },
    // 放大
    zoomIn() {
      if (this.zoom < BaseConfig.graph.maxZoom) {
        this.zoom += BaseConfig.graph.zoomStep;
        this.processInstance.getGraph().zoomTo(this.zoom / 100, { x: window.innerWidth / 2, y: 0 });
        this.processInstance.getGraph().refresh();
      }
    },
    // 缩小
    zoomOut() {
      if (this.zoom > BaseConfig.graph.minZoom) {
        this.zoom -= BaseConfig.graph.zoomStep;
        this.processInstance.getGraph().zoomTo(this.zoom / 100, { x: window.innerWidth / 2, y: 0 });
        this.processInstance.getGraph().refresh();
      }
    },
    // 导出图片
    downloadImage() {
      this.processInstance.getGraph().downloadImage('Graph', 'image/webp', '#f5f7ff');
    },
    // 关闭抽屉
    drawerClose() {
      this.drawer = false;
      this.processInstance.refresh();
    },
    // 更新节点
    saveNode(event) {
      this.processInstance.getGraph().update(this.currentItem, event);
      this.commit();
    },
    // 提交数据  isUpdate 强等于 false 则不需要更新 store 的退出确认
    commit(isUpdate) {
      if (isUpdate !== false) {
        this.setEdit(true);
      }
      const allData = combinateNodes(this.processInstance.getData(), this.processInstance.getGraph());
      this.setProcess(deepClone(allData));
    },
    // 关闭自动保存
    beforeClose() {
      this.$refs.drawer.collect();
      this.drawerClose();
    },
    ...mapActions('designerStore', ['setProcess', 'setEdit']),
  },
};
</script>

<style scoped lang="less">
.x-process-editor {
  height: 100%;
  width: 100%;
  position: relative;
  .g6-grid-container {
    z-index: 0 !important;
  }
  > section {
    width: 100%;
    height: 100%;
    canvas {
      position: absolute !important;
      z-index: 1 !important;
    }
  }
  .zoom-box {
    position: absolute;
    right: 60px;
    top: 30px;
    z-index: 2;
    > span {
      margin: 0 20px;
      display: inline-block;
      width: 48px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      user-select: none;
    }
  }
}
</style>
