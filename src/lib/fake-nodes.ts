import { Arrow } from '@antv/g6';

export default {
  nodes: [
    {
      id: 'abc',
      x: 100,
      y: 200,
      shape: 'user',
      title: '任务节点',
      name: '任务节点',
    },
    {
      id: 'efg',
      x: 100,
      y: 250,
      shape: 'branch',
      title: '任务节点13',
      name: '任务节点2',
    },
    {
      id: 'efg1',
      x: 100,
      y: 300,
      shape: 'user',
      title: '任务节点34',
      name: '任务节点21',
    },
  ],
  edges: [
    {
      id: '123',
      source: 'abc',
      target: 'efg',
      style: {
        stroke: '#F6BD16',
        endArrow: {
          path: Arrow.triangle(),
          fill: '#F6BD16',
        },
      },
    },
    {
      id: '1231',
      source: 'efg',
      target: 'efg1',
      style: {
        stroke: '#F6BD16',
        endArrow: {
          path: Arrow.triangle(),
          fill: '#F6BD16',
        },
      },
    },
  ],
};
