const startIcon = require('@/assets/picture/start.png').default;
const boxIcon = require('@/assets/picture/box.png').default;
const whiteIcon = require('@/assets/picture/mession-white.png').default;
const wirteIcon = require('@/assets/picture/wirte-white.png').default;
const outIcon = require('@/assets/picture/out-white.png').default;
const inIcon = require('@/assets/picture/in-white.png').default;
const plusIcon = require('@/assets/picture/plus.png').default;

const node: FakeObj = {
  // 开始节点
  start: {
    shapeType: 'rect',
    type: 'node',
    size: [200, 60],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    titleImg: startIcon,
    statusImg: boxIcon,
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'start',
    titleFill: 'rgb(87,106,149)',
    editable: true,
  },
  // 任务节点
  user: {
    shapeType: 'rect',
    type: 'node',
    size: [200, 60],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    titleImg: whiteIcon,
    statusImg: boxIcon,
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'user',
    titleFill: 'rgb(255, 148, 62)',
    editable: true,
  },
  // 会签
  countersign: {
    shapeType: 'rect',
    type: 'node',
    size: [200, 60],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    titleImg: wirteIcon,
    statusImg: boxIcon,
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'user',
    titleFill: 'rgb(50,150,250)',
    editable: true,
  },
  // 异步子流程
  async: {
    shapeType: 'rect',
    type: 'node',
    size: [200, 60],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    titleImg: outIcon,
    statusImg: boxIcon,
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'user',
    titleFill: 'rgb(251,96,45)',
    editable: true,
  },
  // 同步子流程
  sync: {
    shapeType: 'rect',
    type: 'node',
    size: [200, 60],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    titleImg: inIcon,
    statusImg: boxIcon,
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'user',
    titleFill: 'rgb(251,96,45)',
    editable: true,
  },
  branch: {
    shapeType: 'rect',
    type: 'node',
    size: [200, 60],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    titleImg: boxIcon,
    statusImg: boxIcon,
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'branch',
    name: '请设置条件',
    editable: true,
  },
  // 条件按钮节点
  condition: {
    shapeType: 'rect',
    type: 'node',
    size: [90, 36],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [1, 0.5],
      [0, 0.5],
    ],
    fill: '#fff',
    stroke: '#ddd',
    radius: 16,
    title: '添加条件',
    i18n: 'proess.condition',
    shape: 'condition',
    name: 'condition',
    key: 'CONDITION',
  },
  // 新增节点
  plus: {
    shapeType: 'circle',
    type: 'node',
    fill: '#409EF',
    stroke: '#ddd',
    icon: plusIcon,
    iconWidth: 16,
    iconHeight: 16,
    r: 16,
    name: 'add-node',
    shape: 'plus',
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
  },
  // 流程结束节点 只有一个锚点
  end: {
    shapeType: 'circle',
    type: 'node',
    r: 8,
    fill: '#ddd',
    name: 'end-point',
    isEnd: true,
    i18n: 'process.end',
    textColor: '#000',
    textBaseline: 'top',
    lineHeight: 20,
    shape: 'end',
    anchorPoints: [
      [0.5, 0],
    ],
  },
};

interface FakeObj {
  [key: string]: any;
}

export default { node };
