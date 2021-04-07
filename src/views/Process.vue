<template>
  <div class="process"
       id="process">
    <my-menu :show="showMenu"
             :x="x"
             :y="y"
             :ee="ee" />
    <div id="my"
         class="process-container"></div>
    <el-drawer title="我是标题"
               v-model="drawer"
               direction="rtl"
               :before-close="handleClose"
               destroy-on-close>
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>

<script lang="ts">
/* eslint-disable func-names */

import {
  defineComponent, onMounted, ref, reactive, toRefs,
} from 'vue';
import Process from '@/lib/Process';
import { Grid } from '@antv/g6';
import { onBeforeRouteLeave } from 'vue-router';
import Menu from '../components/Menu.vue';

/* eslint-disable @typescript-eslint/no-var-requires */
const eventEmitter = require('event-emitter');

export default defineComponent({
  components: {
    'my-menu': Menu,
  },
  setup() {
    const ee = eventEmitter();
    const showMenu = ref(false);
    const menuPosition = reactive({
      x: 100,
      y: 1,
    });
    const drawer = ref(false);
    onMounted(() => {
      const bbox: HTMLElement = document.querySelector('#process') as HTMLElement;
      const { width, height } = bbox.getBoundingClientRect();
      /* eslint-disable no-new */
      new Process({
        base: {
          container: document.querySelector('#my') as HTMLElement,
          width,
          height,
          fitCenter: true,
          modes: {
            default: ['drag-canvas', 'drag-node'],
          },
          edgeStateStyles: {
            active: {
              opacity: 0.5,
              stroke: '#f00',
            },
            selected: {
              stroke: '#ff0',
              lineWidth: 3,
            },
          },
          plugins: [new Grid()],
        },
        hooks: {
          'node:click': () => {
            showMenu.value = false;
            drawer.value = true;
          },
          'edge:click': () => {
            showMenu.value = false;
            drawer.value = false;
          },
          'canvas:contextmenu': () => {
            window.oncontextmenu = function () {
              return true;
            };
            showMenu.value = false;
            drawer.value = false;
          },
          'canvas:click': () => {
            showMenu.value = false;
          },
          'node:contextmenu': function (ev: MouseEvent) {
            window.oncontextmenu = function () {
              return false;
            };
            menuPosition.x = (ev as any).canvasX + 5;
            menuPosition.y = (ev as any).canvasY + 5;
            showMenu.value = true;
          },
        },
        emitter: ee,
      });
    });
    ee.on('menu-click', () => {
      console.log('aaaa');
      showMenu.value = false;
    });
    onBeforeRouteLeave(() => {
      // console.log('abc');
    });
    const handleClose = () => {
      console.log('drawer close');
      drawer.value = false;
    };
    const { x, y } = toRefs(menuPosition);
    return {
      showMenu,
      x,
      y,
      handleClose,
      drawer,
      ee,
    };
  },
});
</script>
<style lang="less" scoped>
#process {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .process-container {
    width: 100%;
    height: 100%;
  }
}
</style>
