<template>
  <div class="process-drawer processDrawer" id="processDrawer" v-if="show && currentModel">
    <div class="title-box">
      <span
        class="text"
        v-show="!editName">
        {{currentModel.name}}
        <i class="el-icon-edit" @click="editNodeName"></i>
      </span>
      <el-input
        id="input-name"
        @blur="enterHandler"
        @keyup.native.enter="enterHandler"
        size="small"
        maxlength="25"
        v-show="editName"
        v-model="currentModel.name"/>
    </div>
    <div class="tab-box" >
      <template>
        <Branch ref="branch" v-if="showBranch" :node="currentModel" @collect="collectProps"/>
        <Async ref="asyncComp" v-if="showAsync" :model="currentModel" @collect="collectProps"/>
        <SetHandler
          ref="handler"
          class="handler"
          v-if="showApporver"
          :node="currentModel"
          @collect="collectProps"/>
        <FlowAuthority
          ref="flow"
          v-if="showFlowAuthority"
          :prevNodes="prevNodes"
          :currentModel="currentModel"/>
        <SetAuthority
          ref="authority"
          v-if="showApporver || currentModel.key === 'START'"
          :model="currentModel"
          @collect="collectProps"
          :height="calcHeight"/>
      </template>
    </div>
    <div class="btn-box">
      <el-button size="small" type="default" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>

import Branch from './components/Branch';
import Async from './components/Async';
import SetHandler from './components/SetHandler';
import SetAuthority from './components/SetAuthority';
import BaseConfig from '../BaseConfig';
import FlowAuthority from './components/FlowAuthority';
import { getAllInEdgeNodes } from '../@lib/caclulateHelper';

export default {
  name: 'Drawer',
  props: {
    drawer: {
      type: Boolean,
    },
    node: {
      default: null,
    },
  },
  provide() {
    return {
      getCurrentModel: () => this.currentModel,
    };
  },
  inject: {
    getProcess: {
      from: 'getProcess',
      default: () => {},
    },
  },
  components: {
    Branch,
    Async,
    SetHandler,
    SetAuthority,
    FlowAuthority,
  },
  data() {
    return {
      show: false,
      activeName: 'first',
      currentModel: null,
      editName: false,
      height: 0,
      prevNodes: [],
    };
  },
  watch: {
    // 抽屉的 focus 处理
    drawer(val) {
      if (val) {
        setTimeout(() => {
          this.show = val;
        }, 100);
      } else {
        this.show = false;
      }
      this.editName = false;
    },
    node() {
      this.getDatas();
    },
  },
  computed: {
    showAsync() {
      return this.currentModel.key === BaseConfig.property.async.key || this.currentModel.key === BaseConfig.property.sync.key;
    },
    showBranch() {
      return this.currentModel.key === BaseConfig.property.branch.key;
    },
    showApporver() {
      return this.currentModel.key === BaseConfig.property.approver.key || this.currentModel.key === BaseConfig.property.countersign.key;
    },
    showSubContent() {
      return this.currentModel.key !== BaseConfig.property.start.key;
    },
    isCountersign() {
      if (this.currentModel) {
        return BaseConfig.property.countersign.key === this.currentModel.key;
      }
      return false;
    },
    isApporver() {
      if (this.currentModel) {
        return BaseConfig.property.approver.key === this.currentModel.key;
      }
      return false;
    },
    // 需要计算属性面板的 动态拓展的DOM高度
    calcHeight() {
      if (this.currentModel) {
        if (BaseConfig.property.countersign.key === this.currentModel.key) {
          return `${this.height - 100 - 248 - 124}px`;
        } if (BaseConfig.property.approver.key === this.currentModel.key) {
          return `${this.height - 100 - 150 - 300}px`;
        }
      }
      return `${this.height - 100 - 124 - 52}px`;
    },
    showFlowAuthority() {
      return this.currentModel.key === BaseConfig.property.approver.key || this.currentModel.key === BaseConfig.property.start.key || this.currentModel.key === BaseConfig.property.countersign.key;
    },
  },
  created() {
    // TODO: 整理是否所有都需要用到
    this.$store.dispatch('process/fetchDeptTree');
    // this.$store.dispatch('process/fetchUserList');
    this.$store.dispatch('process/fetchRoleList');
    this.$store.dispatch('process/fetchRoleGroupList');
    this.$store.dispatch('process/fetchSubProcess');
  },
  mounted() {
    this.getDatas();
    setTimeout(() => {
      this.show = true;
      this.$nextTick(() => {
        this.height = document.querySelector('.processDrawer').getBoundingClientRect().height;
      });
    }, 120);
  },
  methods: {
    getDatas() {
      this.currentModel = JSON.parse(JSON.stringify(this.getProcess().selectedItem.getModel()));
      this.prevNodes = getAllInEdgeNodes(this.getProcess().selectedItem)
        .filter(node => node.getModel().key === BaseConfig.property.approver.key)
        .map(node => ({ id: node.getModel().id, name: node.getModel().name }));
    },
    editNodeName() {
      this.editName = true;
      setTimeout(() => {
        document.querySelector('#input-name').focus();
        document.querySelector('#input-name').select();
      }, 50);
    },
    cancel() {
      this.$emit('close', true);
      this.show = false;
    },
    enterHandler() {
      if (!this.currentModel.name) {
        this.$message({ type: 'error', message: '请填写节点名称' });
        document.querySelector('#input-name').focus();
        return;
      }
      if (this.currentModel.name.length > 25) {
        this.$message({ type: 'error', message: '节点名称长度最多为25位' });
        document.querySelector('#input-name').focus();
        document.querySelector('#input-name').select();
        return;
      }
      this.editName = false;
    },
    collectProps(props) {
      Object.assign(this.currentModel, props);
    },
    save() {
      this.collect();
      // this.$emit('save', this.currentModel);
      this.cancel();
    },
    collect() {
      // 收集参数
      const handler = this.$refs.handler && this.$refs.handler.getValue();
      const branch = this.$refs.branch && this.$refs.branch.getValue();
      const asyncVal = this.$refs.asyncComp && this.$refs.asyncComp.getValue();
      const authority = this.$refs.authority && this.$refs.authority.getValue();
      const flow = this.$refs.flow && this.$refs.flow.getValue();
      // 收集编辑项
      if (handler) {
        const {
          specify, member, signType, variables,
        } = handler;
        this.currentModel.specify = specify;
        this.currentModel.variables = variables;
        this.currentModel.member = member;
        this.isCountersign && (this.currentModel.signType = signType);
      }
      // 收集权限
      if (authority && authority.length) {
        this.currentModel.form = authority;
      }
      // 收集子流程
      if (asyncVal) {
        this.currentModel.processId = asyncVal;
      }
      // 收集分支
      if (branch) {
        // console.log(branch);
        this.currentModel.conditionList = branch;
      }
      if (flow) {
        this.currentModel.rejectVal = flow.rejectVal;
        this.currentModel.rejectTarget = flow.rejectTarget;
        this.currentModel.buttons = flow.buttons;
        this.currentModel.transmitters = flow.transmitters;
      }
      this.$emit('save', this.currentModel);
    },
  },
};
</script>

<style lang="less" scoped>

.process-drawer {
    height: 100%;
    width: 100%;
    position:relative;
    box-sizing: border-box;
    &:focus, &:active{
      outline: none;
    }
  .title-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 50px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    padding: 10px 10px 10px 10px;
    color: #666;
    font-size: 14px;
    .text {
      display: inline-block;
      margin-top: 5px;
      margin-left: 5px;
    }
    i {
      &:hover {
        cursor: pointer;
      }
    }
    /deep/ .el-input--small .el-input__inner {
      font-size: 14px;
    }
    .lay {
      display: flex;
      flex-direction: column;
    }
  }
  .tab-box {
    height: calc(100% - 100px);
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    /deep/ .el-tabs__nav-scroll {
      padding-left: 15px;
    }
    /deep/ .el-tabs__header {
      margin: 0;
    }
  }
  .btn-box {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    height: 50px;
    width: 100%;
    text-align: right;
    line-height: 45px;
    padding-right: 20px;
    border-top: 1px solid #ccc;
    /deep/ .el-button--small {
      padding: 9px 20px;
    }
  }
}
</style>
