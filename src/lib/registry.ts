import * as G6 from '@antv/g6';

import nodeShapes from './Node';
import lines from './Edge';
import behaviors from './Behavior';

export default function registry() {
  Reflect.ownKeys(behaviors).forEach((key) => {
    const myKey = key as string;
    G6.registerBehavior(myKey, behaviors[myKey]);
  });
  Reflect.ownKeys(lines).forEach((key) => {
    const myKey = key as string;
    G6.registerEdge(myKey, lines[myKey], 'line');
  });
  console.log(nodeShapes);
  Reflect.ownKeys(nodeShapes).forEach((key) => {
    const myKey = key as string;
    G6.registerNode(`custom-${myKey}`, nodeShapes[myKey], 'node');
  });
}
