/**
 * 节点属性值初始化、合并、修改的辅助工具文件
 */

import formCompoent from '../../components/form';
import gridCompoent from '../../components/grid';
import pageCompoent from '../../components/page';
import printCompoent from '../../components/print';
import processCompoent from '../../components/process';

import { deepClone, makeRandom } from '../../lib/tool';
import uuid from '../../lib/uuid';
import { ONLY_CONTROL } from '../../common/BaseNodeHleper';

// 需要自动生成值得KEY
const keysForAutoGenerateValue = ['key'];

/**
 * 拖拽控件，新增控件实例到渲染器时，初始化控件的各种参数
 * @param { Object } config 控件的默认配置项
 */
function initProps(config = {}) {
  let {
    groups = {}, properties = {},
  } = config;

  let props = {};
  Object.keys(groups).forEach(prop => {
    props[prop] = (groups[prop].keys || []).reduce((obj, key) => {
      let value = (properties[key] || {}).value;
      if (keysForAutoGenerateValue.includes(key) && !value) {
        value = `Field_${makeRandom()}`;
      }
      obj[key] = value;

      return obj;
    }, {});
  });

  return props;
}

/**
 * 根据模块类型和控件名，查找控件的初始化配置
 * @param {*} moduleType 模块类型，form、process、grid、page、print
 * @param {*} controlType 组件名
 */
export function queryInitProps(moduleType, controlType) {
  let controlConfig = null;

  if (moduleType === 'form') {
    controlConfig = formCompoent.configs[controlType];
  } else if (moduleType === 'grid') {
    controlConfig = gridCompoent.configs[controlType];
  } else if (moduleType === 'page') {
    controlConfig = pageCompoent.configs[controlType];
  } else if (moduleType === 'print') {
    controlConfig = printCompoent.configs[controlType];
  } else if (moduleType === 'process') {
    controlConfig = processCompoent.configs[controlType];
  }

  return initProps(deepClone(controlConfig));
}

export default {};