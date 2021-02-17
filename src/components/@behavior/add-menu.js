import eventBus from '@/util/busMgr';

export default {
  getEvents() {
    return {
      'node:contextmenu': 'onContextmenu',
      mousedown: 'onMousedown',
      'canvas:click': 'onCanvasClick',
    };
  },
  onContextmenu(e) {
    const item = e.item;
    const group = item.getContainer();
    const shape = group.get('children')[0];
    if (shape.attrs.showMenu) {
      eventBus.$get(this.graph.busId).$emit('contextmenuClick', e);
    }
  },
  onMousedown(e) {
    eventBus.$get(this.graph.busId).$emit('mousedown', e);
  },
  onCanvasClick(e) {
    eventBus.$get(this.graph.busId).$emit('canvasClick', e);
  },
};
