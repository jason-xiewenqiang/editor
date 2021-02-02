import { Graph } from '@antv/x6';
import { merge } from 'lodash';

const config = {
  // 网格
  grid: {
    visible: true,
    size: 10,
    type: 'dot',
  },
  // 高亮
  highlighting: {
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          strokeWidth: 4,
          stroke: 'rgba(223,234,255,1)',
        },
      },
    },
  },
  // 操作历史
  history: {
    enabled: true,
  },
  // 键盘事件
  keyboard: {
    enabled: true,
  },
  // 剪切框
  clipboard: {
    enabled: true,
  },
  // 选择框
  selecting: {
    enabled: true,
    showNodeSelectionBox: true,
    movable: true,
    rubberband: true,
    className: 'x6-selection-box',
  },
  // 对齐线
  snapline: {
    enabled: true,
  },
  // 滚动条
  scroller: {
    enabled: true,
    pageVisible: false,
    pageBreak: false,
    pannable: true,
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
};

function getConfig(options?: Graph.Options): Graph.Options {
  return merge(config, options) as Graph.Options;
}

export default getConfig;
