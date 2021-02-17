import {
  BehaviorOption,
  IG6GraphEvent,
  IGraph,
  INode,
} from '@antv/g6';

const hoverNode: BehaviorOption = {
  getEvents() {
    return {
      'node:mouseover': 'onMouseover',
      'node:mouseleave': 'onMouseleave',
      'node:mousedown': 'onMousedown',
    };
  },
  onMouseover(e: IG6GraphEvent) {
    const self = this as BehaviorOption;
    const item = e.item as INode;
    const graph = self.graph as IGraph;
    if (item && item.hasState('selected')) {
      return;
    }
    if (self.shouldUpdate?.call(self, e)) {
      graph.setItemState(item, 'hover', true);
    }
    graph.paint();
  },
  onMouseleave(e: IG6GraphEvent) {
    const self = this as BehaviorOption;
    const item = e.item as INode;
    const graph = self.graph as IGraph;
    if (self.shouldUpdate?.call(self, e)) {
      if (item && !item.hasState('selected')) {
        graph.setItemState(item, 'hover', false);
      }
    }
    graph.paint();
  },
  onMousedown() {
    const self = this as BehaviorOption;
    (self.graph as IGraph).setMode('default');
  },
};

interface FakeObj {
  [key: string]: BehaviorOption;
}

const obj: FakeObj = { 'hover-node': hoverNode };

export default obj;
