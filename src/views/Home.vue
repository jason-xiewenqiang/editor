<template>
  <el-container style="height: 100%;">
    <el-header style="padding: 0;">
      <el-menu
        :default-active="activeIndex"
        background-color="#545c64"
        text-color="#fff"
        mode="horizontal"
        active-text-color="#ffd04b"
        style="padding: 0 40px;"
        @select="selectHanle"
        >
        <el-menu-item index="0">Process</el-menu-item>
        <el-menu-item index="1">Strategy</el-menu-item>
        <el-menu-item index="2">Form Builder</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const staticData = ['/process', '/strategy', '/form'];
    const state = reactive({
      // eslint-disable-next-line arrow-parens
      activeIndex: staticData.findIndex(path => path === route.path),
    });
    function selectHanle(val: number) {
      if (val !== state.activeIndex) {
        state.activeIndex = val;
        router.push({ path: staticData[val] });
      }
    }
    const { activeIndex } = state;
    return { activeIndex, selectHanle };
  },
});
</script>
<style lang="less" scoped>
/deep/ .el-main {
  height: calc(100% - 60px);
  padding: 0;
}
</style>
