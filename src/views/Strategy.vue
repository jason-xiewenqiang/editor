<template>
  <div class="strategy">
    <div class="left-panel">
      <el-tree
        :data="treeData"
        node-key="id"
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drop="handleDrop"
        :allow-drop="allowDrop"
        draggable>
      </el-tree>
    </div>
    <div class="center-canvas">
      <div  id="container"></div>
    </div>
    <div class="right-panel">
      <el-collapse v-model="primitiesActive">
        <el-collapse-item
          v-for="item in primitiesData"
          :key="item.name"
          :name="item.name"
          :title="item.title"
        >
          <div v-for="it in item.items" :key="it.label" class="primities-item">
            <i :class="it.icon" @mousedown="mousedownHandle(it, $event)"></i>
            <p class="text">{{it.label}}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog v-model="dialog" title="mmp">
      abc
    </el-dialog>
    <el-drawer title="属性" direction="rtl" v-model="drawer">
      <span>mmp</span>
    </el-drawer>
  </div>
</template>

<script lang="ts">
/* eslint-disable default-case */
import {
  defineComponent, onMounted, ref,
} from 'vue';
import {
  Graph, Dom, Addon, Node,
} from '@antv/x6';
import TreeData from '../lib/strategy-tree';
import { factory } from '../lib/strategy-shape';
import Primities from '../lib/strategy-primities';
import getConfig from '../lib/graph';

const { Dnd } = Addon;

export declare interface FakeNode {
  data: TreeNodeData;
}
export declare interface TreeNodeData {
  [key: string]: object | string | number | boolean;
}
export declare interface DataNode {
  type?: string;
  label?: string;
  attrs?: object;
}
export default defineComponent({
  setup() {
    const drawer = ref(false);
    const dialog = ref(false);
    // graph instance
    let graph: Graph;
    let dnd: Addon.Dnd;
    const changePortsVisible = (visible: boolean) => {
      const ports = document.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGAElement>;
      for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = visible ? 'visible' : 'hidden';
      }
    };
    // life cricle : I need to get render dom
    onMounted(() => {
      graph = new Graph(getConfig({
        container: (document.getElementById('container') as HTMLElement),
      }));
      graph.centerContent();
      dnd = new Dnd({
        target: graph,
        scaled: false,
        animation: true,
        validateNode(droppingNode, options) {
          return droppingNode.shape === 'html'
            ? new Promise<boolean>((resolve) => {
              const { draggingNode, draggingGraph } = options;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const view = draggingGraph.findView(draggingNode)!;
              const contentElem = view.findOne('foreignObject > body > div');
              Dom.addClass(contentElem, 'validating');
              setTimeout(() => {
                Dom.removeClass(contentElem, 'validating');
                resolve(true);
              }, 1000);
            })
            : true;
        },
      });
      graph.bindKey('backspace', () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.removeCells(cells);
        }
      });
      graph.on('node:mouseenter', () => {
        changePortsVisible(true);
      });
      graph.on('node:mouseleave', () => {
        changePortsVisible(false);
      });
      graph.on('node:click', () => {
        const selected = graph.getSelectedCells();
        changePortsVisible(false);
        selected.forEach(() => {
          // console.log(sel.data);
        });
      });
      graph.on('node:dblclick', () => {
        drawer.value = true;
      });
      graph.on('edge:mouseenter', () => {
        console.log('edge');
      });
      graph.on('edge:mouseleave', () => {
        console.log('edge');
      });
      graph.on('edge:selected', () => {
        const selected = graph.getSelectedCells();
        selected.forEach((sel) => {
          console.log(sel);
          const model = sel.getAttrs();
          console.log(model);
          sel.setAttrs({ line: { strokeWidth: 4 } });
        });
      });
      graph.on('blank:click', () => {
        console.log('blank:click');
      });
      graph.on('blank:contextmenu', () => {
        console.log('blank:contextmenu');
      });
    });
    const treeData = TreeData;
    const primitiesData = Primities;
    const primitiesActive = ref(Primities.map((item) => item.name));

    // pass event to DND
    const handleDND = (data: DataNode, ev: MouseEvent) => {
      const { type, label, attrs } = data;
      let node: Node;
      switch (type) {
        case 'device':
        case 'spot':
          node = graph.createNode(factory(type, { attrs: { label: { text: label } } }));
          dnd.start((node as Node), ev);
          break;
        case 'primities':
          node = graph.createNode(factory(type, { attrs: { label: { text: label }, ...attrs } }));
          dnd.start((node as Node), ev);
          break;
      }
    };
    // handle tree node drag
    const handleDragStart = (node: FakeNode, ev: MouseEvent) => {
      handleDND(node.data, ev);
    };
    // forbit on drop
    const allowDrop = () => false;
    // primities mousedown
    const mousedownHandle = (primities: object, $event: MouseEvent) => {
      handleDND(primities, $event);
    };
    return {
      treeData,
      handleDragStart,
      allowDrop,
      primitiesData,
      mousedownHandle,
      drawer,
      dialog,
      primitiesActive,
    };
  },
});
</script>
<style lang="less">
.strategy {
  width: 100%;
  height: 100%;
  position: relative;
  .left-panel {
    position: absolute;
    left:0;
    right: calc(100% - 200px);
    top: 0;
    bottom: 0;
    background-color: #f7f9fb;
    z-index: 5;
    .el-tree {
      background-color: #f7f9fb;
      user-select: none;
    }
  }
  .right-panel {
    position: absolute;
    left: calc(100% - 315px);
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 5;
    border-left: 1px solid #26BEF0;
    .el-collapse-item__header {
      background-color: #26BEF0;
      color: #fff;
      padding-left: 20px;
      box-sizing: border-box;
    }
    .el-collapse-item__wrap {
      border-bottom-color: #26BEF0;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
      box-sizing: border-box;
      padding-left: 10px;
      padding-right: 10px;
    }
    .primities-item {
      display: inline-block;
      color: #26BEF0;
      user-select: none;
      width: 80px;
      height: 80px;
      text-align: center;
      box-sizing: border-box;
      padding-top: 6px;
      i {
        font-size: 40px;
        display: inline-block;
        &:hover {
          cursor: move;
        }
      }
      .text {
        margin: 0;
      }
    }
  }
  .center-canvas {
    width: calc(100% - 515px);
    height: 100%;
    position: relative;
    margin: 0 315px 0 200px;
    #container {
      width: 100%;
      height: 100%;
    }
  }
  .x6-selection-box .x6-widget-selection-box {
    border-color: #31d0c6;
  }
}
</style>
