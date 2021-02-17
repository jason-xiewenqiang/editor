import uuid from '@/util/uuid';

const node = {
  draw(cfg, group) {
    const id = uuid();
    const shape = group.addShape('circle', {
      attrs: {
        id,
        r: 8,
        x: cfg.x,
        y: cfg.y,
        fill: '#ccc',
        name: 'end-point',
      },
      draggable: true,
    });
    // label
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        x: cfg.x - 25,
        y: cfg.y + 20,
        lineHeight: 20,
        text: '流程结束',
        fill: '#000',
        parentId: id,
        name: 'title',
      },
    });
    return shape;
  },
};
const attributes = {};

export default { node, attributes };
