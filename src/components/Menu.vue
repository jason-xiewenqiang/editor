<template>
  <div class="menu" v-show="show" :style="{left: x + 'px', top: y + 'px'}">menu</div>
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
  },
  mounted() {
    console.log(this.x);
    console.log(this.y);
  },
});
</script>
<style lang="less" scoped>
.menu {
  position: absolute;
  z-index: 2;
  padding: 20px;
  background-color: aqua;
  width: 200px;
  height: 200px;
  color: #000;
}
</style>
