<template>
  <div class="container">
    <div class="view">
      <!-- add router view here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyContainer',
};
</script>

<style scoped lang="less">
.container {
  height: calc(100% - 60px);
  box-sizing: border-box;
  padding: 15px 10px;
  background-color: #eee;
  .view {
    background-color: #fff;
    width: 100%;
    height: 100%;
  }
}
</style>
