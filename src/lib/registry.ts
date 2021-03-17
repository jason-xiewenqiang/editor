import * as G6 from '@antv/g6';

import nodeShapes from './Node';
import lines from './Edge';
import behaviors from './Behavior';

export default function registry() {
  // 注册自定义行为
  Reflect.ownKeys(behaviors).forEach((key) => {
    const myKey = key as string;
    G6.registerBehavior(myKey, behaviors[myKey]);
  });
  // 注册自定义连线
  Reflect.ownKeys(lines).forEach((key) => {
    const myKey = key as string;
    G6.registerEdge(myKey, lines[myKey], 'line');
  });
  // 注册自定义节点
  Reflect.ownKeys(nodeShapes).forEach((key) => {
    const myKey = key as string;
    G6.registerNode(`custom-${myKey}`, nodeShapes[myKey], 'node');
  });
}
