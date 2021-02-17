import uuid from '@/util/uuid';

let TWEEN = require('@tweenjs/tween.js/dist/tween.esm');

const node = {
  tweenId: null,
  draw(cfg, group) {
    const wrapId = cfg.id || uuid();
    const r = 16;
    const shape = group.addShape('circle', {
      attrs: {
        id: wrapId,
        fill: '#409EFF',
        r,
        x: cfg.x,
        y: cfg.y,
        stroke: 'rgb(50,150,250)',
        name: 'add-node',
        showMenu: true,
        cursor: 'pointer',
      },
      draggable: true,
    });
    // close Icon
    group.addShape('image', {
      attrs: {
        x: cfg.x - 8,
        y: cfg.y - 8,
        width: 16,
        height: 16,
        cursor: 'pointer',
        img: require('@/assets/picture/plus.png'),
        parentId: wrapId,
        name: 'close-icon',
        opacity: 1,
      },
    });
    return shape;
  },
  setState(name, value, item) {
    const group = item.getContainer();
    const shape = group.get('children')[0];
    const selectStyles = () => {
      const rObj = { r: 16 };
      new TWEEN.Tween(rObj)
        .to({ r: 18 }, 150)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate((data) => {
          shape.attr('r', data.r);
        })
        .start();
      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }
      requestAnimationFrame(animate);
    };
    const unSelectStyle = () => {
      const rObj = { r: 18 };
      new TWEEN.Tween(rObj)
        .to({ r: 16 }, 100)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate((data) => {
          shape.attr('r', data.r);
        })
        .start();
      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }
      requestAnimationFrame(animate);
    };
    switch (name) {
      case 'hover':
        if (value) {
          selectStyles();
        } else {
          unSelectStyle();
        }
        break;
      default:
        break;
    }
  },
};
const attributes = {};

export default { node, attributes };
