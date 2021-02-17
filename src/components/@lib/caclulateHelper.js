/*
 * @Author: jason-xiewenqiang
 * @Email: xiewenqiang@xbrother.com
 * @Date: 2020-11-11 16:10:20
 * @LastEditors: jason-xiewenqiang
 * @LastEditTime: 2020-12-28 14:02:02
 * @Description: 计算辅助
 */

/**
 * 获取插入节点之后的所有节点
 * @param {*} insertNode 插入节点
 * @returns {Array}
 */
export const getNodesAfterInsertNode = (insertNode) => {
  const nodes = [];
  // 判断如果是如果没有连出的线 说明是最后的结束节点
  const outEdges = insertNode.getOutEdges();
  if (outEdges && outEdges.length) {
    outEdges.forEach(edge => {
      const targetNode = edge._cfg.targetNode;
      if (targetNode) {
        nodes.push(targetNode);
        nodes.push(...getNodesAfterInsertNode(targetNode));
      }
    });
  }
  return nodes;
};

/**
 * 判断一个节点是否为 设置 条件节点
 * @param {*} node
 */
export const isBrancNode = (node) => node.getModel().shape === 'custom-branch';

/**
 * 向下移动节点
 * @param {*} position 位置 x y
 * @param {*} node 移动的节点
 */
export const moveDownward = (position, node) => {
  node.updatePosition(position);
};

/**
 * 向上移动节点
 * @param {*} position
 * @param {*} node
 */
export const moveUpward = (position, node) => {
  node.updatePosition(position);
};

/**
 * 向左移动节点
 * @param {*} position
 * @param {*} node
 */
export const moveToLeft = (position, node) => {
  node.updatePosition(position);
};

/**
 * 向右移动节点
 * @param {*} position
 * @param {*} node
 */
export const moveToRight = (position, node) => {
  node.updatePosition(position);
};

/**
 * 获取前一个节点
 * @param {*} node 当前节点
 */
export const getPrevNode = (node) => {
  const inEdges = node.getInEdges();
  if (inEdges.length) {
    return inEdges[0]._cfg.sourceNode;
  }
  return null;
};

/**
 * 获取后一个节点
 * @param {*} node 当前节点
 */
export const getNextNode = (node) => {
  const outEdges = node.getOutEdges();
  if (outEdges.length) {
    return outEdges[0]._cfg.targetNode;
  }
  return null;
};

/**
 * 获取给定节点的所有前 节点 （单线 edge）
 * @param {*} node
 */
export const getAllPrevNodes = (node) => {
  const nodes = [];
  const prevNode = getPrevNode(node);
  if (prevNode) {
    nodes.push(prevNode);
    nodes.push(...getAllPrevNodes(prevNode));
  }
  return nodes;
};

/**
 * 给定一个 数组 去重
 * @param {*} arr
 */
export const unique = (arr) => {
  const res = new Map();
  return arr.filter((a) => !res.has(a) && res.set(a, 1));
};

/**
 * 获取edge下所有的连线的节点
 * @param {*} edge 连线
 */
export const getAllLinkNodes = (edge) => {
  const nodes = [];
  const target = edge._cfg.targetNode;
  if (target) {
    if (nodes.indexOf(target._cfg.id) === -1) { nodes.push(target._cfg.id); }
    const outEdges = target.getOutEdges();
    if (outEdges.length) {
      outEdges.forEach(eg => {
        nodes.push(...getAllLinkNodes(eg));
      });
    }
  }
  return unique(nodes);
};

export const getAllNodeIdsBefore = (inNode) => {
  const nodes = [];
  const inEdges = inNode.getInEdges();
  if (inEdges.length) {
    inEdges.forEach(edge => {
      const node = edge._cfg.sourceNode;
      if (node) {
        if (!nodes.some(n => n.getModel().id === node.getModel().id)) {
          nodes.push(node);
          nodes.push(...getAllNodeIdsBefore(node));
        }
      }
    });
  }
  return nodes;
};

/**
 * 获取添加条件按钮是否为 第一个 分支节点按钮
 * @param {*} conditionNode
 */
export const isFirstCondition = (conditionNode) => {
  const allBeforeNode = getAllNodeIdsBefore(conditionNode);
  return allBeforeNode.every(node => node.getModel().name !== 'condition');
};


export const getFirstConditionNode = (insertNode) => {
  const allReverseNode = getAllNodeIdsBefore(insertNode).reverse();
  let node = null;
  for (let i = 0; i < allReverseNode.length; i++) {
    if (allReverseNode[i].getModel().name === 'condition') {
      node = allReverseNode[i];
      break;
    }
  }
  return node;
};

/**
 * 获取拥有最大的分支按钮节点
 * @param {*} conditionNodes
 */
export const getMaxEdgeCondition = (conditionNodes) => {
  let target;
  conditionNodes.forEach(node => {
    if (target) {
      const outEdge = node.getOutEdges().length;
      const targetEdge = target.getOutEdges().length;
      if (outEdge > targetEdge) {
        target = node;
      }
    } else {
      target = node;
    }
  });
  return target;
};

/**
 * 获取直到根节点
 * @param {*} node
 */
export const getPrevNodes = (node) => {
  const nodes = [];
  const inEdges = node.getInEdges();
  if (inEdges.length) {
    nodes.push(inEdges[0]._cfg.sourceNode);
    nodes.push(...getPrevNodes(inEdges[0]._cfg.sourceNode));
  }
  return nodes;
};

/**
 * 判断是否为 填写条件
 * @param {*} node
 */
export const isPlusDown = (node) => !!node.getModel().plusDown;

/**
 * 广度优先获取回路的节点
 * @param {*} node
 */
export const getLoopNodes = (node) => {
  const nodes = [];
  const outEdges = node.getOutEdges();
  if (outEdges.length) {
    outEdges.forEach(edge => {
      const next = edge._cfg.targetNode;
      // 碰到了 plusDown 就要停下
      if (next && !isPlusDown(next)) {
        nodes.push(next);
        nodes.push(...getLoopNodes(next));
      }
    });
  }
  return nodes;
};

/**
 * 获取 回路后面的第一个 plusDown
 * @param {*} node
 */
export const getFirstPlusDown = (node) => {
  const edge = node.getOutEdges()[0];
  const nextNode = edge._cfg.targetNode;
  if (isPlusDown(nextNode)) {
    return nextNode;
  }
  return getFirstPlusDown(nextNode);
};

/**
 * 给定一个 数组 去重
 * @param {*} arr
 */
export const uniqueNodes = (arr) => {
  const res = new Map();
  return arr.filter((a) => a && !res.has(a.getModel().id) && res.set(a.getModel().id, 1));
};

/**
 * 获取两个节点之间的所有节点
 * @param {*} start
 * @param {*} end
 */
export const getNodesBetweenTwoNode = (start, end) => {
  const nodes = [];
  if (start && end) {
    const endModel = end.getModel();
    const outEdges = start.getOutEdges();
    outEdges.forEach(edge => {
      const nextNode = edge._cfg.targetNode;
      if (nextNode) {
        const model = nextNode.getModel();
        if (model.id !== endModel.id) {
          nodes.push(nextNode);
          nodes.push(...getNodesBetweenTwoNode(nextNode, end));
        }
      }
    });
    return uniqueNodes(nodes);
  }
  return [];
};

/**
 * 获取一个节点的所有前节点 直到根节点
 * @param {*} node
 */
export const getAllInEdgeNodes = (node) => {
  const nodes = [];
  const edges = node.getInEdges();
  if (edges && edges.length) {
    edges.forEach(edge => {
      const sourceNode = edge._cfg.sourceNode;
      if (sourceNode) {
        nodes.push(sourceNode, ...getAllInEdgeNodes(sourceNode));
      }
    });
  }
  return uniqueNodes(nodes);
};

/**
 * 从一个节点开始，向下收集所有节点
 * @param {*} node
 */
export const getAllOutEdgeNodes = (node) => {
  const nodes = [];
  const edges = node.getOutEdges();
  if (edges && edges.length) {
    edges.forEach(edge => {
      const targetNode = edge._cfg.targetNode;
      if (targetNode) {
        nodes.push(targetNode, ...getAllOutEdgeNodes(targetNode));
      }
    });
  }
  return uniqueNodes(nodes);
};

/**
 * 判断是否在同一条连线上
 * @param {*} edge
 * @param {*} insertNode
 */
export const isOnPaht = (edge, insertNode) => {
  const outNodes = getAllOutEdgeNodes(edge._cfg.targetNode);
  return outNodes.some(node => node.getModel().id === insertNode.getModel().id);
};

/**
 *向上查询找到最靠近的 添加条件按钮
 * @param {*} node 起点节点
 */
export const findFirstCondition = (node) => {
  const edge = node.getInEdges()[0];
  const target = edge._cfg.sourceNode;
  if (target && target.getModel().name === 'condition') {
    return target;
  }
  return findFirstCondition(target);
};

export default { };
