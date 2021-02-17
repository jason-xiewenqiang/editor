import uuid from '@/util/uuid';
import { deepClone } from '@/util/tool';
import Config from '../BaseConfig';

/**
 * 创建节点
 * @param {x, y} position 位置
 * @param {...} config 渲染参数
 */
const factory = (type, config) => {
  const id = uuid();
  const node = Object.assign(
    deepClone(Config.node[type]), // 绘制数据
    deepClone({ id, getId: () => id, editable: Config.authority[type] }), // 权限和id
    deepClone(Config.property[type]), // 编辑属性数据
    deepClone(config), // 自定义数据
  );
  node.getWidth = () => (node.size ? node.size[0] : node.r);
  node.getHeight = () => (node.size ? node.size[1] : node.r);
  node.getX = () => (node.x);
  node.getY = () => (node.y);
  console.log(node);
  return node;
};

/**
 * 将服务端返回的数据 渲染成节点需要的数据 并且挂载 开始节点ID 和结束节点ID
 * @param {Object} data
 * @param {G6.graph} graph
 */
export const formatFetchData = (data, graph) => {
  const { nodes } = data;
  // 记录开始节点和结束节点的 id
  const startNode = nodes.filter(node => node.key === Config.property.start.key)[0];
  const endNode = nodes.filter(node => node.key === Config.property.end.key)[0];
  graph.startNodeId = startNode.id;
  graph.endNodeId = endNode.id;
  // 从新进去重建 node
  data.nodes = nodes.map(n => factory(n.key.toLowerCase(), n));
  return deepClone(data);
};

export default factory;
