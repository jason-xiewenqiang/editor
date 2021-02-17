import uuid from '@/util/uuid';

const node = {
  draw(cfg, group) {
    const id = cfg.id || uuid();
    const width = 90;
    const height = 36;
    const shape = group.addShape('rect', {
      attrs: {
        id,
        x: cfg.x - width / 2,
        y: cfg.y,
        width,
        height,
        radius: 16,
        fill: '#fff',
        name: 'condition',
        stroke: '#ddd',
        isFirst: cfg.isFirst || false,
      },
    });
    // label
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        x: cfg.x - width / 2 + 20,
        y: cfg.y + 14,
        lineHeight: 20,
        text: cfg.title,
        fill: '#0289ff',
        parentId: id,
        name: 'title',
      },
    });
    return shape;
  },
  setState(name, value, item) {
    const group = item.getContainer();
    const shape = group.get('children')[0]; // 顺序根据 draw 时确定
    const children = group.findAll(g => g.attrs.parentId === shape.attrs.id);
    const selectStyles = () => {
      shape.attr('stroke', 'rgb(50,150,250)');
      shape.attr('cursor', 'pointer');
      children.forEach(child => {
        child.attr('cursor', 'pointer');
      });
    };
    const unSelectStyles = () => {
      shape.attr('stroke', '#ddd');
      shape.attr('cursor', 'default');
      children.forEach(child => {
        child.attr('cursor', 'default');
      });
    };
    switch (name) {
      case 'selected':
        if (value) {
          selectStyles();
        } else {
          unSelectStyles();
        }
        break;
      case 'hover':
        if (value) {
          selectStyles();
        } else {
          unSelectStyles();
        }
        break;
      default:
        break;
    }
  },
};
const attributes = {};

export default { node, attributes };
