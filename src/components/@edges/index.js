import G6 from '@antv/g6';
import plusLine from './plus-link';
import conditionLink from './condition-link';

const edge = {
  'plus-line': plusLine,
  'condition-line': conditionLink,
};

// 注册连线
export default () => {
  for (let key in edge) {
    G6.registerEdge(key, edge[key], 'line');
  }
};
