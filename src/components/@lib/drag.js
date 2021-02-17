import {
  computedPosition, lookupPVNode, PRE_NODE,
} from '../../common/BaseNodeHleper';
import { removeElement } from '../../lib/dom';

// 标记拖动开始类型，从左侧拖动，用于生成节点
const DRAG_FROM = 'left';

/**
 * 被拖动元素，开始拖动事件
 * @param {*} Vue
 */
function dragStartInstall(Vue) {
  Vue.directive('editor-drag-start', {
    inserted(el, bindings) {
      el.listener = function (e) {
        let value = bindings.value;
        e.dataTransfer.setData('newNodeInfo', value ? JSON.stringify(value) : value);
        e.dataTransfer.setData('from', DRAG_FROM);
        const nodeInfo = value;
        window.nodeInfo = nodeInfo; // 定义全局数据  给dragover事件使用
      };

      el.endListenter = function (e) {
        e.preventDefault();
        removeElement(PRE_NODE);
        window.nodeInfo = null;
      };

      el.addEventListener('dragstart', el.listener);
      el.addEventListener('dragend', el.endListenter);
    },
    unbind(el) {
      el.removeEventListener('dragstart', el.listener);
      el.removeEventListener('dragend', el.endListenter);
    },
  });
}

/**
   * 拖动的目标容器的悬浮事件
   * @param {*} Vue
   */
function dragOverInstall(Vue) {
  Vue.directive('editor-drag-over', {
    inserted(el) {
      el.listener = function (e) {
        e.preventDefault();
      };

      el.addEventListener('dragover', el.listener);
    },
    unbind(el) {
      el.removeEventListener('dragover', el.listener);
    },
  });
}

/**
   * 编辑器  拖动的目标容器的放下事件
   * @param {*} Vue
   * 编辑器  节点创建入口
   */
function dropInstall(Vue) {
  Vue.directive('editor-drop', {
    inserted(el, bindings) {
      el.listener = function (e) {
        e.preventDefault();
        // 如果不是从左侧拖动的，退出执行
        let from = e.dataTransfer.getData('from');
        if (from !== DRAG_FROM) return;

        let pNodeInfo = null;
        let position = null;
        let newNodeInfo = e.dataTransfer.getData('newNodeInfo');
        try {
          newNodeInfo = JSON.parse(newNodeInfo);
        } catch (err) {
          console.log(err);
        }
        const element = document.getElementById(PRE_NODE);
        if (element) { // 存在预览框使用预览框元素上挂载的数据
          position = element.position;
          pNodeInfo = element.pNodeInfo;
          removeElement(PRE_NODE);
        } else { // 不存在预览框重新计算数据
          position = computedPosition(e);
          pNodeInfo = lookupPVNode(e.target);
        }
        window.nodeInfo = null;
        if (!pNodeInfo.id) return;

        let fn = bindings.value;
        typeof fn === 'function' ? fn(pNodeInfo, newNodeInfo, position) : '';
      };

      el.addEventListener('drop', el.listener);
    },
    unbind(el) {
      el.removeEventListener('drop', el.listener);
    },
  });
}

export default function install(Vue) {
  dragStartInstall(Vue);
  dragOverInstall(Vue);
  dropInstall(Vue);
}
