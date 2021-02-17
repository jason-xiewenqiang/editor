// eslint-disable-next-line import/no-extraneous-dependencies
const Util = require('@antv/util');

export default {
  getEvents() {
    return {
      'node:click': 'onClick',
      'canvas:click': 'onCanvasClick',
      'canvas:mouseover': 'onCanvasMouseover',
    };
  },
  onClick(e) {
    const self = this;
    const item = e.item;
    const graph = self.graph;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);

    // 选中节点时 取消所有连线的选中状态
    const selectedEdges = graph.findAllByState('edge', 'selected');
    Util.each(selectedEdges, edge => {
      graph.setItemState(edge, 'selected', false);
    });

    // 只能单选中节点
    const selected = graph.findAllByState('node', 'selected');
    Util.each(selected, node => {
      if (node !== item) {
        graph.setItemState(node, 'selected', false);
      }
    });

    // 切花节点状态
    if (item.hasState('selected')) {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', false);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', true);
      }
    }
    graph.setAutoPaint(autoPaint);
    graph.paint();
  },
  onCanvasClick() {
    const graph = this.graph;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);

    // 点击画布时 清除节点所有选中状态
    const selected = graph.findAllByState('node', 'selected');
    Util.each(selected, node => {
      graph.setItemState(node, 'selected', false);
    });

    // 点击画布时 清除连线所有选中状态
    const selectedEdges = graph.findAllByState('edge', 'selected');
    Util.each(selectedEdges, edge => {
      graph.setItemState(edge, 'selected', false);
    });

    graph.paint();
    graph.setAutoPaint(autoPaint);

    // 同时将编辑模式设置成默认状态
    graph.setMode('default');
  },
  onCanvasMouseover() {
    const graph = this.graph;
    graph.paint();
  },
};
