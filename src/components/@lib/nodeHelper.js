import { makeRandom, deepClone } from '../../lib/tool';
import { queryInitProps } from './propHelper';
import {
  LAYOUT_CONTROLL,
  lookupNode,
  lookupParentNode,
  insertNodeToXTabs,
  insertNodeToXLayout,
  insertNodeToXTable,
} from '../../common/BaseNodeHleper';
import { nodeInfoType } from '../../common/NodeTypeHleper';
import {
  X_LAYOUT, X_TABS, BCP_BC_FLEX_ROW, X_SUBLIST, X_PANEL,
} from '../../components/NameEnum';

/**
 * 重置DATA中的所有ID的值
 * @param {*} data 节点配置
 */
function resetId(newNodeInfo) {
  if (!newNodeInfo) return newNodeInfo;

  // 实现方式一，遍历KEY。优点：不会有缺漏；缺点：数据复杂时，耗时多
  // let data = deepClone(newNodeInfo);

  // if (typeof data.id === 'string') {
  //   data.id = makeRandom();
  // }

  // Object.keys(data).forEach(key => {
  //   let value = data[key];
  //   getObjectType(value) === 'object' ? resetId(value) : '';
  // });

  // 实现方式一，正则匹配ID。优点：速度快，不会有缺漏；缺点：数据包含Function时，JSON会出错
  let data = deepClone(newNodeInfo);
  let tmp = JSON.stringify(data);
  tmp = tmp.replace(/"id":[ ]*"[^"]*"/g, () => `"id": "${makeRandom()}"`);
  try {
    data = JSON.parse(tmp);
  } catch (err) {
    console.log(err);
  }

  return data;
}

/**
 * 从数据项中创建新的节点
 * @param { Object } newNodeInfo 待创建节点的信息，必定包含的字段值{type}，type值为基础组件的name值
 */
function generateNodeFromDataItem(newNodeInfo) {
  let data = resetId(newNodeInfo);
  return {
    id: makeRandom(),
    type: BCP_BC_FLEX_ROW,
    child: [
      data,
    ],
  };
}

/**
 * 从基础组件中创建实例
 *
 * @param {*} moduleType
 * @param {*} pNodeType
 * @param { Object } newNodeInfo 待创建节点的信息，必定包含的字段值{type}，type值为基础组件的name值
 */
function generateNodeFromBaseComponent(moduleType, pNodeType, newNodeType) {
  let info = {
    id: makeRandom(),
    type: newNodeType,
    props: queryInitProps(moduleType, newNodeType),
  };

  // 当生成布局控件时，令它独占一行，不需要根据父级节点类型进行判断，是否用x-row包裹
  if (LAYOUT_CONTROLL.includes(newNodeType)) return info;

  // 父级节点是容器节点时，使用x-row进行包裹
  if (pNodeType === 0 || pNodeType === 2 || pNodeType === 6) {
    let data = {
      id: makeRandom(),
      type: BCP_BC_FLEX_ROW,
      child: [
        info,
      ],
    };
    return data;
  }
  if (pNodeType === 1 || pNodeType === 3 || pNodeType === 4) {
    return info;
  }

  return null;
}

/**
 * 根据父节点的不同生成子节点的数据
 * @param { Number } pNodeType 父节点类型，0为渲染器的根节点；1为非根节点
 * @param { Object } newNodeInfo 待创建节点的信息，必定包含的字段值{type}，type值为基础组件的name值
 */
function generateNode(moduleType, pNodeType, newNodeInfo) {
  let {
    type,
    props = null,
  } = newNodeInfo;

  if (props === null) {
    return generateNodeFromBaseComponent(moduleType, pNodeType, type);
  }

  return generateNodeFromDataItem(newNodeInfo);
}

/**
 * 新建子节点
 * @param { String } moduleType 模块类型，form、process、grid、print、page
 * @param { Array } data 数据源
 * @param { String } pNodeId 父节点ID
 * @param { Number } pNodeType 父节点类型，0为渲染器的根节点；1为普通节点；2为XTabs控件；-1为错误
 * @param { Object } newNodeInfo 待创建节点的信息，必定包含的字段值{type}，type值为基础组件的name值
 */
export function insertNode(moduleType, data, pNodeInfo, newNodeInfo, position) {
  let { id: pNodeId, type: pNodeType, value: pNodeValue } = pNodeInfo;
  let childVNode = generateNode(moduleType, pNodeType, newNodeInfo);
  const { index, type } = position;

  let pVNode = lookupNode(data, pNodeId);

  if (nodeInfoType[pNodeType] === X_TABS || nodeInfoType[pNodeType] === X_PANEL) { // XTabs控件的子组件新增处理
    insertNodeToXTabs(pVNode, pNodeValue, childVNode);
  } else if (nodeInfoType[pNodeType] === X_LAYOUT) { // xLayout控件的子组件新增处理
    insertNodeToXLayout(pVNode, childVNode);
  } else if (nodeInfoType[pNodeType] === X_SUBLIST) {
    insertNodeToXTable(pVNode, childVNode, position);
  } else if (index > -1) { //  大于-1代表行内移动排序
    if (type === 'left') pVNode.child.splice(index, 0, childVNode);
    if (type === 'right') pVNode.child.splice(index + 1, 0, childVNode);
  } else if (index === -1) { //  -1代表多行间移动排序
    const pId = pVNode.id;
    pVNode = lookupParentNode(data, pNodeId);
    console.log(pVNode);
    const rowIndex = pVNode.child.findIndex(_ => _.id === pId);
    if (!LAYOUT_CONTROLL.includes(childVNode.type)) childVNode = { id: makeRandom(), type: BCP_BC_FLEX_ROW, child: [childVNode] };
    if (type === 'top') pVNode.child.splice(rowIndex, 0, childVNode);
    if (type === 'bottom') pVNode.child.splice(rowIndex + 1, 0, childVNode);
  } else if (index === -2) { //  -2代表移动到容器最底层
    pVNode.child.push(childVNode);
  }
  if (childVNode.type === BCP_BC_FLEX_ROW) {
    return childVNode.child[0].id;
  }
  return childVNode.id;
}

export default {};