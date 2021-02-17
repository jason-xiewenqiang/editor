/* eslint-disable no-template-curly-in-string */
/*
 * @Author: jason-xiewenqiang
 * @Email: xiewenqiang@xbrother.com
 * @Date: 2020-11-12 10:04:57
 * @LastEditors: jason-xiewenqiang
 * @LastEditTime: 2021-01-22 14:06:03
 * @Description: 流程编辑器 基础配置
 */

/** anchorPoints 顺序
  *  ---- 0 ----
  *  |         |
  *  3         1
  *  |         |
  *  ---- 2 ----
*/
//  节点参数  shapeType -> rect 必须设置 size  circle 必须设置 r
const node = {
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
    titleImg: require('@/assets/picture/start.png'),
    statusImg: require('@/assets/picture/box.png'),
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'custom-user',
    titleFill: 'rgb(87,106,149)',
    editable: true,
  },
  // 任务节点
  approver: {
    shapeType: 'rect',
    type: 'node',
    size: [200, 60],
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    titleImg: require('@/assets/picture/mession-white.png'),
    statusImg: require('@/assets/picture/box.png'),
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'custom-user',
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
    titleImg: require('@/assets/picture/wirte-white.png'),
    statusImg: require('@/assets/picture/box.png'),
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'custom-user',
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
    titleImg: require('@/assets/picture/out-white.png'),
    statusImg: require('@/assets/picture/box.png'),
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'custom-user',
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
    titleImg: require('@/assets/picture/in-white.png'),
    statusImg: require('@/assets/picture/box.png'),
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'custom-user',
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
    titleImg: require('@/assets/picture/box.png'),
    statusImg: require('@/assets/picture/box.png'),
    fill: '#fff',
    stroke: '#ddd',
    radius: 4,
    shape: 'custom-branch',
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
    shape: 'custom-condition',
    name: 'condition',
    key: 'CONDITION',
  },
  // 新增节点
  plus: {
    shapeType: 'circle',
    type: 'node',
    fill: '#409EF',
    stroke: '#ddd',
    icon: require('@/assets/picture/plus.png'),
    iconWidth: 16,
    iconHeight: 16,
    r: 16,
    name: 'add-node',
    shape: 'custom-add',
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
    shape: 'custom-end',
    anchorPoints: [
      [0.5, 0],
    ],
  },
};

// 画布参数
const graph = {
  maxZoom: 200, // 最大缩放 原始值 100
  minZoom: 50, // 最小缩放 原始值 100
  zoomStep: 10,
  horizontalGutter: 40, // 图元水平间隔 最外边 到最外边的距离
  vertivalGutter: 30, // 图元垂直间隔 最外边 到最外边的距离
  plusGutter: 30,
  nodeWdith: 200,
};

/*
  锚点、图形控制坐标系
  (0, 0) ---------- (0.5, 0) ---------- (1, 0)
  |                                          |
  |                                          |
  |                                          |
  (0, 0.5)                            (1, 0.5)
  |                                          |
  |                                          |
  |                                          |
  (0, 1) ---------- (0.5, 1) ---------- (1, 1)
*/

// 连线参数
const edge = {
  type: 'polyline', // 连线样式
  source: '', // 连线起点 item 的 id
  target: '', // 连线目标的 item 的 id
  sourceAnchor: 1, // 参考 anchorPoints 元素顺序 和 上图 锚点、图形控制坐标系
  targetAnchor: 0,
  style: {
    endArrow: true, // 是否显示 终点 箭头
    lineWidth: 2, // 连线线宽
    stroke: 'lightBlue', // 连线颜色
  },
};

// 编辑权限 -- 打开编辑 drawer
const authority = {
  start: true,
  approver: true,
  countersign: true,
  async: true,
  sync: true,
  branch: true,
  plus: false,
  end: false,
  condition: false,
};

const property = {
  start: {
    title: '发起',
    name: '发起节点',
    key: 'START',
    form: [],
    transmitters: false,
    buttons: [
      { id: 'SAVE', name: '保存', url: '/api/v1/bpm/tasks/saveFormData' },
      { id: 'EXECUTE', name: '提交', url: '/api/v1/bpm/tasks/execute' },
      // { id: 'BACKOUT', name: '撤销', url: '/api/v1/bpm/tasks/backout' },
    ],
    attributes: {
      resourceId: '',
      name: '用户任务',
      type: 'normal',
      candidateType: '',
      candidateGroups: [],
      action_buttons: [],
      form_properties: [],
      task_listeners: [],
      variables: [],
    },
  },
  approver: {
    title: '用户任务',
    name: '用户任务',
    key: 'APPROVER',
    specify: '0', // 指定？ 0 - 成员， 1 - 部门， 2 - 角色， 3 - 字段
    variables: '', // 指定的字段
    member: [], // 选中的
    form: [],
    rejectVal: '',
    rejectTarget: '',
    transmitters: false,
    buttons: [
      { id: 'SAVE', name: '保存', url: '/api/v1/bpm/tasks/saveFormData' },
      { id: 'EXECUTE', name: '提交', url: '/api/v1/bpm/tasks/execute' },
      // { id: 'BACKOUT', name: '撤销', url: '/api/v1/bpm/tasks/backout' },
    ],
    attributes: {
      resourceId: '',
      name: '',
      type: 'normal',
      candidateType: '',
      candidateGroups: [],
      action_buttons: [], // 写死
      form_properties: [],
      task_listeners: [], // 写死
      variables: [],
    },
  },
  countersign: {
    title: '会签',
    name: '会签',
    key: 'COUNTERSIGN',
    signType: '3', // 会签的类型 1 - 一票通过, 2 - 一票否决, 3 - 全票通过, 4 - 少数服从多数
    specify: '0', // 指定？ 0 - 成员， 3 - 字段
    variables: '', // 指定的字段
    member: [], // 选中的
    form: [],
    buttons: [
      { id: 'AGREE', name: '同意', url: '/api/v1/bpm/tasks/agreeSign' },
      { id: 'DISAGREE', name: '反对', url: '/api/v1/bpm/tasks/rejectSign' },
    ],
    signTypeMap: [
      '${agree >= 1} && ${agree == 0}',
      '${reject >= 1 } && ${reject == 0}',
      '${agree == nrOfInstances} && ${agree != nrOfInstances}',
      '${agree > reject} && ${agree <= reject}',
    ],
    attributes: {
      resourceId: '',
      name: '',
      type: 'sign',
      sign_rules: '',
      candidateGroups: [],
      form_properties: [],
      action_buttons: [
        { id: 'AGREE', name: '同意', url: '/api/v1/bpm/tasks/agreeSign' },
        { id: 'DISAGREE', name: '反对', url: '/api/v1/bpm/tasks/rejectSign' },
      ], // 写死的
      variables: [], // 这个值如果是选择了表单字段 跟进 specify 类型决定 与 普通用户节点一致
      assignees: [], // 如果是选择了 人员 （成员）
    },
  },
  async: {
    title: '异步子流程',
    name: '异步子流程',
    key: 'ASYNC',
    processType: 'async', // 表示流程的同步或者异步
    processId: '', // 关联的子流程的id
    attributes: {
      resourceId: '',
      name: '',
      type: 'asynCallActivity',
      sub_process: {
        sub_process_key: '', // 子流程resourceId
        params: {
          key: '',
        },
      },
      form_properties: [],
    },
  },
  sync: {
    title: '同步子流程',
    name: '同步子流程',
    key: 'SYNC',
    processType: 'sync',
    processId: '',
    attributes: {
      resourceId: '', // 当前节点的id
      name: '',
      type: 'synCallActivity',
      sub_process: {
        sub_process_key: '', // 子流程resourceId
        params: {
          key: '',
        },
      },
      form_properties: [],
    },
  },
  branch: {
    title: '条件',
    name: '请设置条件',
    key: 'BRANCH',
    conditionList: [],
    variables: [], // 要从conditionList中取到 key
    attributes: {
      resourceId: '',
      name: '',
      conditions: [],
      variables: [],
    },
  },
  condition: {
    key: 'CONDITION',
  },
  end: {
    key: 'END',
  },
  plus: {
    key: 'PLUS',
  },
};

export default {
  node,
  graph,
  edge,
  authority,
  property,
};
