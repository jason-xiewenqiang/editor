export default {
  getDefaultCfg() {
    return {
      backKeyCode: 8,
      deleteKeyCode: 46,
    };
  },
  getEvents() {
    return {
      keyup: 'onKeyUp',
      keydown: 'onKeyDown',
    };
  },

  // 键盘事件
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    switch (code) {
      case this.deleteKeyCode:
      case this.backKeyCode:
        // eslint-disable-next-line no-case-declarations
        if (this.graph.selectedItem) {
          const id = this.graph.selectedItem._cfg.id;
          this.graph.remove(this.graph.findById(id));
          this.graph.selectedItem = null;
        }
        break;
      default:
        break;
    }
  },
  onKeyUp() {
    this.keydown = false;
  },
};
