<template>
  <div class="process" id="process">
    <div id="my" class="process-container"></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-new */
import { defineComponent, onMounted } from 'vue';
import Process from '@/lib/Process';
import { Grid } from '@antv/g6';
/* eslint-disable @typescript-eslint/no-var-requires */
const eventEmitter = require('event-emitter');

export default defineComponent({
  setup() {
    const ee = eventEmitter();
    onMounted(() => {
      const bbox: HTMLElement = document.querySelector('#process') as HTMLElement;
      const { width, height } = bbox.getBoundingClientRect();
      // eslint-disable-next-line no-new
      new Process({
        base: {
          container: (document.querySelector('#my') as HTMLElement),
          width,
          height,
          plugins: [new Grid()],
        },
        hooks: {
          click: (ev: MouseEvent) => { console.log('click', ev); },
          'node:click': () => { console.log('node click'); },
          'edge:click': () => { console.log('edge click'); },
        },
        emitter: ee,
      });
    });
    ee.on('test', (msg: string | number | boolean | object) => {
      console.log('event-emitter test ', msg);
    });
  },
});
</script>
<style lang="less" scoped>
#process {
  width: 100%;
  height: 100%;
  .process-container {
    width: 100%;
    height: 100%;
  }
}
</style>
