<template>
  <div class="my-menu">
    <div class="app-logo">
      <img v-if="isCollapse && showLogo" src="@/assets/picture/collpase-logo.png" width="32"/>
      <img v-if="!isCollapse && showLogo" src="@/assets/picture/logo-login.png" width="140"/>
    </div>
    <div class="menu-content">
      <el-menu
        mode="vertical"
        :default-active="active"
        active-text-color="#fff"
        background-color="#1b2b33"
        text-color="#fff"
        @select="selectHandle"
        :collapse="isCollapse">
        <el-menu-item v-for="menu in menus" :key="menu.index" :index="menu.index">
          <i :class="[menu.icon + ' icon-set']"></i>
          <div class="title" slot="title">{{ menu.title }} <i v-if="!isCollapse" class="el-icon-arrow-right"></i></div>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardMenu',
  props: ['collpase'],
  data() {
    return {
      menus: [
        {
          index: 'module',
          title: '模块管理',
          path: '',
          icon: 'el-icon-toilet-paper',
        },
        {
          index: 'dataDictionary',
          title: '数据字典',
          path: '',
          icon: 'el-icon-coin',
        },
      ],
      active: 'module',
      isCollapse: false,
      showLogo: false,
    };
  },
  watch: {
    collpase(val) {
      this.isCollapse = val;
      this.showLogo = false;
      setTimeout(() => {
        this.showLogo = true;
      }, 200);
    },
  },
  mounted() {
    this.isCollpase = this.collpase;
    this.showLogo = true;
  },
  methods: {
    selectHandle(index, indexPath) {
      this.$message({ type: 'info', message: `Click Menu Item : ${index} - ${indexPath}` });
    },
  },
};
</script>
<style scoped lang="less">
.my-menu {
  /deep/ .el-menu {
    width: 200px;
    border-right: none;
  }
  /deep/ .el-menu--collapse {
    width: 64px;
  }
  .app-logo {
    height: 60px;
    width: 100%;
    background-color: #1b2b33;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 3px 10px #f2f2f2;
    box-sizing: border-box;
    border-bottom: 1px solid;
    border-image: linear-gradient(#999, #ccc, #999) 30 30;
    overflow: hidden;
  }
  /deep/ .el-menu-item .title{
    display: inline-block;
    width: 130px;
    box-sizing: border-box;
    padding-left: 5px;
    text-overflow: hidden;
    i {
      float: right;
      margin-top: 18px;
      color: #fff;
    }
  }
  /deep/ .el-menu-item.is-active {
    background-color: transparent !important;
    .title {
      color: #409EFF;
      > i {
        color: #409EFF;
      }
    }
    .icon-set {
      color: #409EFF;
    }
  }
  /deep/ .el-menu-item {
    .icon-set {
      color: #fff;
    }
  }
}
</style>
