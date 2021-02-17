import Creater from './createHelper';
import BaseConfig from '../BaseConfig';
import EdgeHelper from './edgeHelper';

/**
 * 如果没有流程信息 - 则先按照默认几个数据节点进行渲染
 * @param {*} firstPoint
 * @param {*} graph
 */
export const getDefaultView = (firstPoint, graph) => {
  const startNode = Creater('start', { x: firstPoint.x, y: firstPoint.y });
  const plus = Creater('plus', { x: startNode.getX(), y: startNode.getY() + BaseConfig.graph.plusGutter });
  const endNode = Creater('end', { x: plus.getX(), y: plus.getY() + plus.getHeight() / 2 + BaseConfig.graph.vertivalGutter });

  if (graph) {
    graph.startNodeId = startNode.getId();
    graph.endNodeId = endNode.getId();
  }

  return {
    nodes: [
      startNode,
      plus,
      endNode,
    ],
    edges: [
      EdgeHelper(startNode.getId(), plus.getId(), { sourceAnchor: 2, targetAnchor: 0 }),
      EdgeHelper(plus.getId(), endNode.getId(), { sourceAnchor: 2, targetAnchor: 0 }),
    ],
  };
};

export default { };
