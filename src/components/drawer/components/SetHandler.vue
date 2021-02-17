
<template>
  <div class="set-handler" v-if="model">
    <div class="title" v-if="isCountersign">会签类型</div>
    <div class="radio-group" v-if="isCountersign">
        <el-select size="small" v-model="model.signType" @change="countersignChange">
          <template v-for="opt in countersignOptions">
            <el-option :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
          </template>
        </el-select>
    </div>
    <div class="title">指定成员</div>
    <div class="radio-group">
        <el-radio-group v-model="model.specify" @change="specifyChange">
          <template v-for="radio in getRadioGroup">
            <el-radio :label="radio.value" :key="radio.label">{{radio.label}}</el-radio>
          </template>
        </el-radio-group>
    </div>
    <div class="operator">
      <template v-if="!showSelectCountersign">
        <el-button size="small"  icon="el-icon-plus" type="primary" @click="addMember">添加{{getText}}</el-button> <span>已选 {{selectCount}} {{getText}}</span>
      </template>
      <template v-if="showSelectCountersign">
        <el-select size="small" v-model="model.variables">
          <template v-for="opt in formOptions">
            <el-option :key="opt.key" :value="opt.value" :label="opt.label"></el-option>
          </template>
        </el-select>
      </template>
    </div>
    <base-dialog ref='dialog'></base-dialog>
  </div>
</template>

<script>
import uuid from '@/util/uuid';
import BaseConfig from '../../BaseConfig';
/* eslint-disable no-template-curly-in-string */
export default {
  name: 'SetHandler',
  inject: ['getProcess'],
  props: {
    node: {
      default: null,
    },
  },
  watch: {
    node(val) {
      if (val) {
        this.model = val;
      }
    },
  },
  data() {
    return {
      model: {
        signType: '',
        variables: '',
        specify: '0',
        member: [],
      },
      selectCount: 0, // 选中的长度
      countersignOptions: [ // 会签模式
        { label: '一票通过', value: '0' },
        // { label: '一票否决', value: '1' },
        { label: '全票通过', value: '2' },
        { label: '少数服从多数', value: '3' },
      ],
      formOptions: [],
      radioGroup: [
        {
          label: '成员',
          value: '0',
        },
        {
          label: '部门',
          value: '1',
        },
        {
          label: '角色',
          value: '2',
        },
        {
          label: '字段',
          value: '3',
        },
      ],
    };
  },
  created() {
    this.formOptions = this.getFormatedControl();
  },
  mounted() {
    this.model = JSON.parse(JSON.stringify(this.node));
    this.selectCount = this.model.member.length;
  },
  computed: {
    getRadioGroup() {
      if (this.model) {
        if (BaseConfig.property.countersign.key === this.model.key) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.radioGroup.splice(1, 2);
          return this.radioGroup;
        }
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        // this.radioGroup.splice(this.radioGroup.length - 1, 1);
        return this.radioGroup;
      }
      return [];
    },
    showSelectCountersign() {
      return this.model.specify === '3';
    },
    isCountersign() {
      if (this.model) {
        return BaseConfig.property.countersign.key === this.model.key;
      }
      return false;
    },
    getText() {
      if (this.model) {
        return this.radioGroup[this.model.specify].label;
      }
      return '';
    },
  },
  methods: {
    addMember() {
      const config = {
        title: '选择' + this.radioGroup[this.model.specify].label,
        width: '768px',
        data: this.model,
        displayFooter: true,
        closeOnClickModal: false,
        contentComponent: () => import('./Select.vue'), // 渲染页面
        confirmHandler: () => {
          this.model.member = this.$refs.dialog.$children[0].$children[2].getValue();
          this.selectCount = this.model.member.length;
        }, // 确认回调
        cancelHandler: () => { },
      };
      this.$refs.dialog.init(config);
    },
    getValue() {
      return this.model;
    },
    getFormatedControl() {
      const list = [];
      const control = this.$store.state.designerStore.control;
      if (control && control.length) {
        control.forEach(cont => {
          const { props, type } = cont;
          // FIXME: 业务 此处只要选择人员的才能进行被勾选
          if (type === 'xPerson') {
            const { base } = props;
            const {
              label, key,
            } = base;
            const item = {
              value: key, label, key: uuid(),
            };
            list.push(item);
          }
        });
      }
      return list;
    },
    specifyChange() {
      this.model.member = [];
      this.selectCount = 0;
    },
    countersignChange(val) {
      try {
        const graph = this.getProcess().getGraph();
        // 查下一个节点是否为 condition 节点
        const nextNode = graph.findById(this.model.id)?.getOutEdges()[0]._cfg.target?.getOutEdges()[0]._cfg.target;
        if (nextNode && nextNode?.getModel().key === BaseConfig.property.condition.key) {
          const nextBranchNodes = nextNode.getOutEdges().map(edge => edge._cfg.target);
          if (nextBranchNodes && Array.isArray(nextBranchNodes)) {
            nextBranchNodes.forEach(node => {
              const model = node.getModel();
              const signTypes = BaseConfig.property.countersign.signTypeMap[val].split('&&');
              if (model.side === 'right') {
                model.rule = signTypes[0];
              }
              if (model.side === 'left') {
                model.rule = signTypes[1];
              }
              graph.update(node, model);
            });
          }
        }
      } catch (e) { console.log(e); }
    },
  },
};
</script>

<style lang="less" scoped>
.set-handler {
  padding: 10px 15px 20px 25px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  .title{
    margin-bottom: 20px;
  }
  .radio-group {
    margin-bottom: 25px;
  }
}
</style>
