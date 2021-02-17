<template>
  <div class="condition-box" v-if="!this.node.rule">
    <el-alert
      title="温馨提示："
      type="info"
      show-icon
      description="1、5种控件元素可做条件：多选框、下拉框、单选框、数字框、开关。且是必填。
                  2、当列表中有多个条件时，条件间的关系默认为 '与（&&）'"
      close-text="我知道了"
    >
    </el-alert>
    <!-- <el-button size="small" type="primary" icon="el-icon-plus" @click="addItem">添加条件</el-button> -->
    <div class="condition-list">
      <div class="edit-item">
        <el-select v-model="item.field" size="small" class="field-select" @change="selectItemChange">
          <el-option
            v-for="opt in fieldOptions"
            :key="opt.key"
            :label="opt.label"
            :value="opt.value"
            >{{ opt.label }}</el-option
          >
        </el-select>
        <el-select v-model="item.relation" size="small" class="rela-select">
          <el-option
            v-for="opt in getRelation"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
            >{{ opt.label }}</el-option
          >
        </el-select>
        <el-input v-if="item.type === 'xNumber' || item.type === ''" class="input" size="small" v-model="item.val" placeholder="请输入数字" />
        <el-select
          v-else
          v-model="item.val"
          :multiple="item.type === 'xCheckbox' || (item.type === 'xSelect' && item.multiple)"
          size="small"
          placeholder="请选择"
          class="input">
          <el-option
            v-for="opt in selectOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
            >{{ opt.label }}</el-option
          >
        </el-select>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addItem(item)"
          >添加条件</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table :data="list" style="width: 100%;" border>
        <el-table-column prop="field" width="145" label="字段">
          <template slot-scope="scope">
            <el-select v-model="scope.row.field" size="small" v-if="scope.row.edit">
              <el-option
                v-for="opt in fieldOptions"
                :key="opt.key"
                :label="opt.label"
                :value="opt.value"
                >{{ opt.label }}</el-option
              >
            </el-select>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="relation" width="110" label="运算符">
          <template slot-scope="scope">
            <el-select v-model="scope.row.relation" size="small" v-if="scope.row.edit">
              <el-option
                v-for="opt in getRelation"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
                >{{ opt.label }}</el-option
              >
            </el-select>
            <span v-else>{{ getsRelationText(scope.row.relation) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="val" width="160" label="值">
          <template slot-scope="scope">
            <el-input
              class="input"
              size="small"
              v-model="scope.row.val"
              placeholder="请输入值..."
              v-if="scope.row.edit"
            />
            <span v-else>{{ getOptionText(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="!scope.row.edit" @click="delItem(scope.row)">删除</el-button>
            <!-- <el-button type="text" size="small" v-if="!scope.row.edit" @click="editItem(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" v-if="scope.row.edit" @click="saveItem(scope.row)"
              >保存</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import uuid from '@/util/uuid';

export default {
  name: 'Branch',
  props: {
    node: {
      type: Object,
    },
  },
  inject: {
    getProcess: {
      from: 'getProcess',
      default: () => {},
    },
    getCurrentModel: {
      from: 'getCurrentModel',
      default: () => {},
    },
  },
  data() {
    return {
      item: {
        field: '',
        relation: '',
        val: '',
        id: uuid(),
        name: '',
        type: '',
        data: null,
        selectOptions: [],
        multiple: false,
      },
      list: [],
      fieldOptions: [],
      relationOptions: [
        { label: '=', value: '==' },
        { label: '<', value: '<' },
        { label: '>', value: '>' },
        { label: '<=', value: '<=' },
        { label: '>=', value: '>=' },
        { label: '!=', value: '!=' },
      ],
      // 能成为分支条件的表单空间类型
      fieldMap: [
        'xSelect',
        'xNumber',
        'xCheckbox',
        'xRadio',
        'xSwitch',
      ],
      selectOptions: [],
    };
  },
  created() {
    this.fieldOptions = this.getControl();
  },
  mounted() {
    this.list = JSON.parse(JSON.stringify(this.node.conditionList));
  },
  computed: {
    getRelation() {
      if (this.item.type === 'xNumber') {
        return this.relationOptions;
      }
      return [this.relationOptions[0], this.relationOptions[this.relationOptions.length - 1]];
    },
  },
  methods: {
    selectItemChange(val) {
      const { type, data } = this.fieldOptions.filter(opt => opt.value === val)[0];
      this.item.type = type;
      this.item.data = data;
      this.item.multiple = data.props.base.multiple;
      this.getSelectOptions(type, val);
      if (type === 'xCheckbox' || type === 'xSelect') {
        this.item.val = [];
      } else {
        this.item.val = '';
      }
      if (type === 'xNumber') {
        this.item.dataType = 'Number';
      } else if (type === 'xSwitch') {
        this.item.dataType = 'Boolean';
      } else {
        this.item.dataType = 'String';
      }
    },
    addItem(item) {
      if (this.validate(item)) {
        const name = this.fieldOptions.filter(opt => item.field === opt.value)[0].name;
        const obj = {
          id: uuid(),
          edit: false,
          ...JSON.parse(JSON.stringify(item)),
          name,
        };
        this.list.unshift(obj);
        this.resetItem();
      } else {
        this.$message({ type: 'warning', message: '请完善或输入正确条件参数方可加入列表' });
      }
    },
    editItem(item) {
      item.edit = true;
    },
    delItem(item) {
      const index = this.list.findIndex(it => it.id === item.id);
      this.list.splice(index, 1);
    },
    saveItem(item) {
      const name = this.fieldOptions.filter(opt => item.field === opt.value)[0].name;
      item.name = name;
      item.edit = false;
    },
    validate(item) {
      if (item.type === 'xCheckbox') {
        return !!(item.field && item.relation && item.val.length);
      }
      if (item.type === 'xNumber') {
        return /([+]\d+[.]\d+|[-]\d+[.]\d+|\d+[.]\d+|[+]\d+|[-]\d+|\d+)/ig.test(item.val);
      }
      return !!(item.field && item.relation && item.val !== '');
    },
    resetItem() {
      this.item.val = '';
      this.item.field = '';
      this.item.relation = '';
      this.item.type = '';
      this.item.data = null;
      this.selectOptions = [];
      this.item.multiple = false;
    },
    getValue() {
      return this.list.map(item => {
        if (item.type === 'xCheckbox' || item.type === 'xSelect') {
          if (item.val && Array.isArray(item.val)) {
            item.val = item.val.sort();
          }
        }
        return item;
      });
    },
    getControl() {
      const list = [];
      const control = this.$store.state.designerStore.control;
      if (control && control.length) {
        control.forEach(cont => {
          if (this.fieldMap.includes(cont.type)) {
            const { props, type } = cont;
            const { base } = props;
            const {
              label, key, required, multiple,
            } = base;
            if (required) {
              const item = {
                label,
                value: key,
                key: uuid(),
                name: label,
                type,
                data: JSON.parse(JSON.stringify(cont)),
                selectOptions: [],
                multiple,
              };
              list.push(item);
            }
          }
        });
      }
      return list;
    },
    getSelectOptions(type, key) {
      const control = this.$store.state.designerStore.control;
      if (control && control.length) {
        const item = control.filter(cont => cont.type === type && cont.props.base.key === key)[0];
        const { props } = item;
        const { base } = props;
        const {
          option, dataSource, closeText, openText,
        } = base;
        switch (type) {
          case 'xCheckbox':
            this.selectOptions = [...option];
            break;
          case 'xSelect':
            // console.log(dataSource.option);
            this.selectOptions = dataSource.option || [];
            break;
          case 'xRadio':
            this.selectOptions = [...option];
            break;
          case 'xSwitch':
            this.selectOptions = [{ label: closeText, value: false }, { label: openText, value: true }];
            break;
          default:
            this.selectOptions = [];
            break;
        }
        this.item.selectOptions = [...this.selectOptions];
      }
    },
    getOptionText(row) {
      if (row.type === 'xCheckbox' || (row.type === 'xSelect' && row.multiple)) {
        if (row.val && row.val.length) {
          return row.val.map(v => row.selectOptions.filter(opt => opt.value === v)[0].label).join(',');
        }
      } else if (row.type !== 'xNumber') {
        return row.selectOptions.filter(opt => opt.value === row.val)[0].label;
      }
      return row.val;
    },
    getsRelationText(val) {
      return this.relationOptions.filter(opt => opt.value === val)[0].label;
    },
  },
};
</script>

<style lang="less" scoped>
.condition-box {
  padding: 5px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  .condition-list {
    .edit-item {
      box-sizing: border-box;
      padding: 5px;
      margin: 5px 0;
      .index {
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin-right: 10px;
      }
      .field-select {
        width: 130px;
        margin-right: 10px;
      }
      .rela-select {
        width: 100px;
        margin-right: 10px;
      }
      .input {
        width: 150px;
        margin-right: 10px;
      }
      /deep/ .el-button {
        padding: 9px;
      }
    }
  }
  .table {
    padding: 5px;
    box-sizing: border-box;
    /deep/ .el-table .el-table__header-wrapper {
      overflow: initial;
    }
    /deep/ .el-table__body-wrapper {
      margin-top: 1px;
    }
  }
}
</style>
