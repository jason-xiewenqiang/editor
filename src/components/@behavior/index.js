import G6 from '@antv/g6';
import hoverNode from './hover-node';

const behaviorMap = {
  'hover-node': hoverNode,
};

// 注册 行为
export default () => {
  for (let key in behaviorMap) {
    G6.registerBehavior(key, behaviorMap[key]);
  }
};
