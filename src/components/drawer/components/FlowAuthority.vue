<template>
  <div class="flow-authority">
    <div class="title">
      流程操作权限 <i class="el-icon-edit edit-btn" title="编辑名称" @click="editBtnName"></i>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="text">
          <span>基本操作</span>
        </div>
        <div class="options" v-if="isCountsign">
          <template v-for="item in countersign">
            <el-checkbox :key="item.id" v-model="item.checked" :disabled="item.disabled">{{
              item.name
            }}</el-checkbox>
          </template>
        </div>
        <div class="options" v-else>
          <template v-for="item in base">
            <el-checkbox
              :key="item.id"
              v-model="item.checked"
              :disabled="item.disabled"
              v-if="isStart && item.id !== 'CHANGE'"
              >{{ item.name }}</el-checkbox
            >
            <el-checkbox
              :key="item.id"
              v-model="item.checked"
              :disabled="item.disabled"
              v-if="!isStart"
              >{{ item.name }}</el-checkbox
            >
          </template>
        </div>
      </el-col>
      <el-col :span="24" v-if="!isStart && !isCountsign">
        <div class="text">
          <span>驳回操作</span>
        </div>
        <div class="options">
          <el-radio v-model="rejectVal" @change="radioChande" label="first">驳回到开始</el-radio>
          <el-radio
            v-model="rejectVal"
            @change="radioChande"
            label="specified"
            style="margin-bottom: 0;"
            >驳回到指定活动</el-radio
          >
          <el-button type="text" @click="resetReject">重置</el-button>
        </div>
      </el-col>
      <el-col :span="24" v-if="isApprover">
        <div class="text">
          <span>选择指定活动</span>
        </div>
        <div class="options">
          <el-select size="small" :disabled="rejectVal === 'first' || rejectVal === ''" v-model="rejectTarget">
            <el-option v-for="opt in prevNodes" :key="opt.id" :value="opt.id" :label="opt.name">{{
              opt.name
            }}</el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="24" v-if="isApprover || isStart">
        <div class="text">
          <span>抄送操作</span>
        </div>
        <div class="options">
          <template>
            <el-checkbox v-model="transmitters">选择抄送人</el-checkbox>
          </template>
        </div>
      </el-col>
    </el-row>
    <base-dialog ref="edit"></base-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/util/tool';
import BaseConfig from '../../BaseConfig';

export default {
  name: 'FlowAuthority',
  props: {
    type: {
      type: String,
      default: 'approver',
    },
    currentModel: {
      type: Object,
    },
    prevNodes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rejectVal: '',
      rejectTarget: '',
      transmitters: false,
      base: [
        {
          id: 'SAVE',
          name: '保存',
          url: '/api/v1/bpm/tasks/saveFormData',
          checked: true,
          disabled: true,
        },
        {
          id: 'EXECUTE',
          name: '提交',
          url: '/api/v1/bpm/tasks/execute',
          checked: true,
          disabled: true,
        },
        {
          id: 'CHANGE',
          name: '转办',
          url: '/api/v1/bpm/tasks/changeAssignee',
          checked: false,
        },
        {
          id: 'BACKOUT',
          name: '撤销',
          url: '/api/v1/bpm/tasks/backout',
          checked: false,
        },
      ],
      countersign: [
        {
          id: 'AGREE',
          name: '同意',
          url: '/api/v1/bpm/tasks/agreeSign',
          checked: true,
          disabled: true,
        },
        {
          id: 'DISAGREE',
          name: '反对',
          url: '/api/v1/bpm/tasks/rejectSign',
          checked: true,
          disabled: true,
        },
      ],
      reject: [
        {
          id: 'REJECT',
          name: '驳回',
          url: '/api/v1/bpm/tasks/reject',
        },
      ],
    };
  },
  mounted() {
    this.rejectVal = this.currentModel.rejectVal || '';
    this.rejectTarget = this.currentModel.rejectTarget || '';
    this.transmitters = this.currentModel.transmitters || false;
    this.base[2].checked = this.currentModel.buttons.some(but => but.id === 'CHANGE');
    this.base[3].checked = this.currentModel.buttons.some(but => but.id === 'BACKOUT');
    // 回填数据
    this.currentModel.buttons.forEach(btn => {
      this.base.forEach(b => {
        if (b.id === btn.id) {
          b.name = btn.name;
        }
      });
      this.countersign.forEach(b => {
        if (b.id === btn.id) {
          b.name = btn.name;
        }
      });
      if (btn.id === 'REJECT') {
        this.reject[0].name = btn.name;
      }
    });
  },
  computed: {
    isStart() {
      return this.currentModel.key === BaseConfig.property.start.key;
    },
    isCountsign() {
      return this.currentModel.key === BaseConfig.property.countersign.key;
    },
    isApprover() {
      return this.currentModel.key === BaseConfig.property.approver.key;
    },
  },
  methods: {
    radioChande() {
      this.rejectTarget = '';
    },
    resetReject() {
      this.rejectVal = '';
      this.rejectTarget = '';
    },
    editBtnName() {
      this.$refs.edit.init({
        title: '编辑操作按钮名称',
        width: '475px',
        data: {
          base: deepClone(this.base),
          reject: deepClone(this.reject),
          type: this.currentModel.key,
          countersign: deepClone(this.countersign),
        },
        displayFooter: true,
        closeOnClickModal: false,
        contentComponent: () => import('./EditBtnName.vue'), // 渲染页面
        // eslint-disable-next-line consistent-return
        confirmHandler: () => {
          const btnList = deepClone(this.$refs.edit.$children[0].$children[2].getValue());
          if (btnList.every(btn => btn.name !== '')) {
            switch (this.currentModel.key) {
              case BaseConfig.property.start.key:
                this.base = [...btnList];
                break;
              case BaseConfig.property.approver.key:
                this.base = [btnList[0], btnList[1], btnList[2], btnList[3]];
                this.reject = [btnList[4]];
                break;
              case BaseConfig.property.countersign.key:
                this.countersign = [...btnList];
                break;
              default:
                break;
            }
          } else {
            this.$message({ type: 'warning', message: '按钮名称不可为空，请填写' });
            return false;
          }
        }, // 确认回调
        cancelHandler: () => {},
      });
    },
    getValue() {
      let buttons = [];
      switch (this.currentModel.key) {
        case BaseConfig.property.start.key:
          buttons = this.base.filter(item => item.checked);
          break;
        case BaseConfig.property.approver.key:
          buttons = this.base.filter(item => item.checked);
          if (this.rejectVal) {
            this.reject[0].type = this.rejectVal;
            this.reject[0].rejectNodeId = this.rejectTarget;
            buttons.push(...this.reject);
          }
          break;
        case BaseConfig.property.countersign.key:
          buttons = this.countersign.filter(item => item.checked);
          break;
        default:
          break;
      }
      return {
        buttons, rejectTarget: this.rejectTarget, rejectVal: this.rejectVal, transmitters: this.transmitters,
      };
    },
  },
};
</script>

<style scoped lang="less">
.flow-authority {
  padding: 10px 15px 20px 25px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  .title {
    margin-bottom: 20px;
    .edit-btn {
      cursor: pointer;
    }
  }
  /deep/ .el-row {
    margin: 0;
  }
  /deep/ .el-col {
    border-bottom: 1px solid #ccc;
    padding: 15px;
    box-sizing: border-box;
    padding-left: 15px;
    padding-right: 0;
    display: flex;
    .text {
      width: 30%;
      display: flex;
      align-items: center;
      span {
        display: inline-block;
      }
    }
    .options {
      flex: 1;
      /deep/ .el-radio {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
