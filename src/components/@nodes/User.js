import uuid from '@/util/uuid';

const node = {
  draw(cfg, group) {
    const [wrapWidth, wrapHeight] = cfg.size;
    const referenceX = cfg.x - wrapWidth / 2;
    const referenceY = cfg.y - wrapHeight / 2;
    const radius = cfg.radius || 4;

    // 构建外层的包裹成层
    const wrapId = cfg.id || uuid();
    const shape = group.addShape(cfg.shapeType, {
      attrs: {
        id: wrapId,
        x: referenceX,
        y: referenceY,
        width: wrapWidth,
        height: wrapHeight,
        radius,
        fill: cfg.fill,
        stroke: cfg.stroke,
        name: 'wrap-box',
        editable: cfg.editable,
      },
      draggable: true,
    });

    // title-box
    group.addShape('rect', {
      attrs: {
        x: referenceX + 1,
        y: referenceY + 1,
        width: wrapWidth - 2,
        height: 24,
        radius: [radius - 1, radius - 1, 0, 0],
        parentId: wrapId,
        fill: cfg.titleFill,
        name: 'title-box',
      },
    });

    // label
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        x: referenceX + 24,
        y: referenceY + 8,
        lineHeight: 20,
        text: cfg.title,
        fill: '#fff',
        parentId: wrapId,
        name: 'title',
      },
    });

    // name
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        x: referenceX + 24,
        y: referenceY + 36,
        lineHeight: 20,
        text: cfg.name.length > 10 ? cfg.name.substring(0, 10) + '...' : cfg.name,
        fill: '#000',
        parentId: wrapId,
        name: 'name',
      },
    });

    // close Icon
    group.addShape('image', {
      attrs: {
        x: referenceX + wrapWidth - 20,
        y: referenceY + 4,
        width: 16,
        height: 16,
        cursor: 'pointer',
        img: require('@/assets/picture/del.png'),
        parentId: wrapId,
        name: 'close-icon',
        opacity: 0,
        isClose: true,
      },
    });


    // first Icon
    if (cfg.titleImg) {
      group.addShape('image', {
        attrs: {
          x: referenceX + 4,
          y: referenceY + 5,
          width: 16,
          height: 16,
          cursor: 'pointer',
          img: cfg.titleImg,
        },
        name: 'title-icon',
      });
    }

    // state icon
    // group.addShape('image', {
    //   attrs: {
    //     x: referenceX + wrapWidth - 24,
    //     y: referenceY + 32,
    //     width: 16,
    //     height: 16,
    //     cursor: 'default',
    //     img: require('@/assets/picture/rej.png'),
    //   },
    //   name: 'state-icon',
    // });

    return shape;
  },
  setState(name, value, item) {
    const group = item.getContainer();
    const shape = group.get('children')[0];
    const closeIcon = group.findAll(circle => circle.attrs.isClose);
    const children = group.findAll(g => g.attrs.parentId === shape.attrs.id);
    const model = item.getModel();
    const selectStyles = () => {
      shape.attr('stroke', 'rgb(50,150,250)');
      shape.attr('cursor', 'pointer');
      if (model.key !== 'START') {
        closeIcon.forEach(circle => {
          circle.attr('opacity', 1);
        });
      }
      children.forEach(child => {
        child.attr('cursor', 'pointer');
      });
    };
    const unSelectStyles = () => {
      shape.attr('stroke', '#ddd');
      shape.attr('cursor', 'default');
      closeIcon.forEach(circle => {
        circle.attr('opacity', 0);
      });
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
const attributes = { };

export default { node, attributes };
