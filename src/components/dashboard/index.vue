<template>
  <div class="dashboard">
    <div class="dash-left">
      <Menu :collpase="collpase"/>
    </div>
    <div class="dash-right">
      <MyHeader @collpase-change="collpaseChange" :collpase="collpase"/>
      <MyContainer/>
    </div>
  </div>
</template>

<script>
import Menu from './Menu';
import MyHeader from './Header';
import MyContainer from './Container';

export default {
  name: 'Dashboard',
  components: { Menu, MyHeader, MyContainer },
  data() {
    return {
      collpase: false,
    };
  },
  methods: {
    collpaseChange(val) {
      this.collpase = val;
    },
  },
};
</script>

<style scoped lang='less'>
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  .dash-left {
    width: auto;
    background-color: #1b2b33;
  }
  .dash-right {
    flex: 1;
    height: 100%;
  }
}
</style>
