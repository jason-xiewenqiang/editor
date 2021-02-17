<template>
  <div class="set-authority" :style="{ height: height }" v-if="height">
    <div class="title">表单操作权限</div>
    <el-row>
      <el-col :span="8">全选/取消</el-col>
      <el-col :span="16">
        <el-checkbox v-model="visibleAll" @change="changeAll('visible', visibleAll)"
          >可见</el-checkbox
        >
        <el-checkbox v-model="disabledAll" @change="changeAll('disabled', disabledAll)"
          >禁用</el-checkbox
        >
        <el-checkbox v-model="requiredAll" @change="changeAll('required', requiredAll)"
          >必填</el-checkbox
        >
      </el-col>
      <template v-for="(aut, index) in authorities">
        <el-col :span="8" :key="aut.key">{{ aut.name }}</el-col>
        <el-col :span="16" :key="aut.key + '_' + index">
          <el-checkbox v-model="aut.visible" :disabled="aut.canEdit" @change="visiableChange()"
            >可见</el-checkbox
          >
          <el-checkbox v-model="aut.disabled" :disabled="aut.canEdit" @change="editChange(aut)"
            >禁用</el-checkbox
          >
          <el-checkbox v-model="aut.required" :disabled="aut.canEdit" @change="requireChange(aut)"
            >必填</el-checkbox
          >
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import uuid from '@/util/uuid';

export default {
  name: 'SetAuthority',
  props: {
    height: {
      default: 0,
    },
    model: {
      default: null,
    },
  },
  data() {
    return {
      authorities: [],
      visibleAll: false,
      disabledAll: false,
      requiredAll: false,
    };
  },
  watch: {
    height(val) {
      if (val) {
        this.height = val;
      }
    },
  },
  created() {
    this.authorities = this.getFormatedControl();
    this.visibleAll = this.authorities.every(item => item.visible);
    this.disabledAll = this.authorities.every(item => item.disabled);
    this.requiredAll = this.authorities.every(item => item.required);
  },
  methods: {
    getValue() {
      return this.authorities;
    },
    changeAll(key, val) {
      this.authorities.forEach(item => {
        if (key === 'required' && val) {
          item.visible = val;
          this.visibleAll = val;
        }
        item[key] = val;
      });
    },
    getFormatedControl() {
      let list = [];
      // 以表单项为主
      const control = this.$store.state.designerStore.control;
      if (control && control.length) {
        control.forEach(cont => {
          const { props } = cont;
          const { base } = props;
          const {
            label, required, disabled, key, defaultValue,
          } = base;
          if (defaultValue !== '系统自动获取') {
            let item = {
              id: key,
              name: label,
              visible: true,
              required: defaultValue === '系统自动获取' ? true : !!required,
              disabled,
              key: uuid(),
              canEdit: defaultValue === '系统自动获取',
            };
            // 如果匹配到 id 对应 key 相同的项 则复制之前的设置
            try {
              if (this.model && this.model.form.length) {
                const items = this.model.form.filter(it => it.id === key);
                if (items && Array.isArray(items)) {
                  const it = items[0];
                  if (it) {
                    item = { ...item, ...it, ...{ label } };
                  }
                }
              }
            } catch (e) { console.log(e); }
            list.push(item);
          }
        });
      }
      return list;
    },
    visiableChange() {
      this.visibleAll = this.authorities.every(item => item.visible);
    },
    editChange(item) {
      if (item.disabled) {
        item.visible = true;
      }
      this.disabledAll = this.authorities.every(it => it.disabled);
    },
    requireChange(item) {
      if (item.required) {
        item.visible = true;
      }
      this.requiredAll = this.authorities.every(it => it.required);
    },
  },
};
</script>

<style lang="less" scoped>
.set-authority {
  padding: 10px 15px 20px 25px;
  box-sizing: border-box;
  .title {
    margin-bottom: 5px;
    margin-top: 5px;
  }
  /deep/ .el-row {
    margin: 0;
    height: calc(100% - 21px);
    overflow-y: auto;
  }
  /deep/ .el-col {
    border-bottom: 1px solid #ccc;
    padding: 15px;
    box-sizing: border-box;
    padding-left: 15px;
    padding-right: 0;
    height: 52px;
  }
}
</style>
