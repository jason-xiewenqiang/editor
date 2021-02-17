/* eslint-disable array-callback-return */
export default {
  getEvents() {
    return {
      'node:mouseover': 'onMouseover',
      'node:mouseleave': 'onMouseleave',
      'node:mousedown': 'onMousedown',
    };
  },
  onMouseover(e) {
    const self = this;
    const item = e.item;
    const graph = self.graph;
    if (item.hasState('selected')) {
      return;
    }
    if (self.shouldUpdate.call(self, e)) {
      graph.setItemState(item, 'hover', true);
    }

    graph.paint();
  },
  onMouseleave(e) {
    const self = this;
    const item = e.item;
    const graph = self.graph;
    if (self.shouldUpdate.call(self, e)) {
      if (!item.hasState('selected')) {
        graph.setItemState(item, 'hover', false);
      }
    }
    graph.paint();
  },
  onMousedown() {
    this.graph.setMode('default');
  },
};
