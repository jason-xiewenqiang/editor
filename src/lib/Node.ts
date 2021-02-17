import {
  ShapeOptions,
  ModelConfig,
  IGroup,
  INode,
  IEdge,
  ICombo,
  IShape,
} from '@antv/g6';
import { uuid } from './tool';

const delIcon = require('@/assets/picture/del.png').default;
const closeIbt = require('@/assets/picture/clo.png').default;

const user: ShapeOptions = {
  drawShape(cfg?: ModelConfig | undefined, group?: IGroup | undefined): IShape {
    const [wrapWidth, wrapHeight] = cfg?.size as Array<number>;
    const referenceX = (cfg?.x as number) - wrapWidth / 2;
    const referenceY = (cfg?.y as number) - wrapHeight / 2;
    const radius = (cfg?.radius as number) || 4;

    // 构建外层的包裹成层
    const wrapId = cfg?.id || uuid();
    const shape = group?.addShape((cfg?.shapeType as string), {
      attrs: {
        id: wrapId,
        x: referenceX,
        y: referenceY,
        width: wrapWidth,
        height: wrapHeight,
        radius,
        fill: cfg?.fill as string,
        stroke: cfg?.stroke as string,
        name: 'wrap-box',
        editable: cfg?.editable,
        shapeType: 'rect',
      },
      draggable: true,
    });

    if (group) {
      // title-box
      group.addShape('rect', {
        attrs: {
          x: referenceX + 1,
          y: referenceY + 1,
          width: wrapWidth - 2,
          height: 24,
          radius: [radius - 1, radius - 1, 0, 0],
          parentId: wrapId,
          fill: cfg?.titleFill as string,
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
          text: cfg?.title,
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
          text: cfg?.name,
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
          img: delIcon,
          parentId: wrapId,
          name: 'close-icon',
          opacity: 0,
          isClose: true,
        },
      });

      // first Icon
      if (cfg?.titleImg) {
        group.addShape('image', {
          attrs: {
            x: referenceX + 4,
            y: referenceY + 5,
            width: 16,
            height: 16,
            cursor: 'pointer',
            img: cfg?.titleImg,
          },
          name: 'title-icon',
        });
      }
    }
    return shape as IShape;
  },
  setState(name, value, item?: INode | IEdge | ICombo| undefined) {
    if (item) {
      const group = item.getContainer();
      const shape = group.get('children')[0];
      const closeIcon = group.findAll((circle) => circle.attrs.isClose);
      const children = group.findAll((g) => g.attrs.parentId === shape.attrs.id);
      const model = item.getModel();
      const selectStyles = () => {
        shape.attr('stroke', 'rgb(50,150,250)');
        shape.attr('cursor', 'pointer');
        if (model.key !== 'START') {
          closeIcon.forEach((circle) => {
            circle.attr('opacity', 1);
          });
        }
        children.forEach((child) => {
          child.attr('cursor', 'pointer');
        });
      };
      const unSelectStyles = () => {
        shape.attr('stroke', '#ddd');
        shape.attr('cursor', 'default');
        closeIcon.forEach((circle) => {
          circle.attr('opacity', 0);
        });
        children.forEach((child) => {
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
    }
  },
};

const end: ShapeOptions = {
  draw(cfg?: ModelConfig | undefined, group?: IGroup | undefined): IShape {
    const id = uuid();
    const shape = group?.addShape('circle', {
      attrs: {
        id,
        r: 8,
        x: cfg?.x,
        y: cfg?.y,
        fill: '#ccc',
        name: 'end-point',
      },
      draggable: true,
    });
    if (group) {
      // label
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          x: (cfg?.x as number) - 25,
          y: (cfg?.y as number) + 20,
          lineHeight: 20,
          text: '流程结束',
          fill: '#000',
          parentId: id,
          name: 'title',
        },
      });
    }
    return shape as IShape;
  },
};

const start: ShapeOptions = {
  draw(cfg?: ModelConfig | undefined, group?: IGroup | undefined): IShape {
    const id = uuid();
    const shape = group?.addShape('circle', {
      attrs: {
        id,
        r: 8,
        x: cfg?.x,
        y: cfg?.y,
        fill: '#ccc',
        name: 'start-point',
      },
      draggable: true,
    });
    if (group) {
      // label
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          x: (cfg?.x as number) - 25,
          y: (cfg?.y as number) + 20,
          lineHeight: 20,
          text: '流程结束',
          fill: '#000',
          parentId: id,
          name: 'title',
        },
      });
    }
    return shape as IShape;
  },
};

const branch: ShapeOptions = {
  drawShape(cfg?: ModelConfig | undefined, group?: IGroup | undefined): IShape {
    const [wrapWidth, wrapHeight] = cfg?.size as Array<number>;
    const referenceX = (cfg?.x as number) - wrapWidth / 2;
    const referenceY = (cfg?.y as number) - wrapHeight / 2;
    const radius = (cfg?.radius as number) || 4;

    // 构建外层的包裹成层
    const wrapId = cfg?.id || uuid();
    const shape = group?.addShape((cfg?.shapeType as string), {
      attrs: {
        id: wrapId,
        x: referenceX,
        y: referenceY,
        width: wrapWidth,
        height: wrapHeight,
        radius,
        fill: cfg?.fill as string,
        stroke: cfg?.stroke as string,
        name: 'wrap-box',
        editable: cfg?.editable,
      },
      draggable: true,
    });

    if (group) {
      // label
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          x: referenceX + 24,
          y: referenceY + 10,
          lineHeight: 20,
          text: cfg?.title,
          fill: '#65bc83',
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
          text: cfg?.name,
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
          img: closeIbt,
          parentId: wrapId,
          name: 'close-icon',
          opacity: 0,
          isClose: true,
        },
      });
    }
    return shape as IShape;
  },
  setState(name, value, item?: INode | IEdge | ICombo| undefined) {
    if (item) {
      const group = item.getContainer();
      const shape = group.get('children')[0]; // 顺序根据 draw 时确定
      const closeIcon = group.findAll((circle) => circle.attrs.isClose);
      const children = group.findAll((g) => g.attrs.parentId === shape.attrs.id);
      const selectStyles = () => {
        shape.attr('stroke', 'rgb(50,150,250)');
        shape.attr('cursor', 'pointer');
        closeIcon.forEach((circle) => {
          circle.attr('opacity', 1);
        });
        children.forEach((child) => {
          child.attr('cursor', 'pointer');
        });
      };
      const unSelectStyles = () => {
        shape.attr('stroke', '#ddd');
        shape.attr('cursor', 'default');
        closeIcon.forEach((circle) => {
          circle.attr('opacity', 0);
        });
        children.forEach((child) => {
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
    }
  },
};

const condition: ShapeOptions = {
  draw(cfg?: ModelConfig | undefined, group?: IGroup | undefined): IShape {
    const id = cfg?.id || uuid();
    const width = 90;
    const height = 36;
    const shape = group?.addShape('rect', {
      attrs: {
        id,
        x: (cfg?.x as number) - width / 2,
        y: cfg?.y,
        width,
        height,
        radius: 16,
        fill: '#fff',
        name: 'condition',
        stroke: '#ddd',
        isFirst: cfg?.isFirst || false,
      },
    });
    if (group) {
      // label
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          x: (cfg?.x as number) - width / 2 + 20,
          y: (cfg?.y as number) + 14,
          lineHeight: 20,
          text: cfg?.title,
          fill: '#0289ff',
          parentId: id,
          name: 'title',
        },
      });
    }
    return shape as IShape;
  },
  setState(name, value, item?: INode | IEdge | ICombo| undefined) {
    if (item) {
      const group = item.getContainer();
      const shape = group.get('children')[0]; // 顺序根据 draw 时确定
      const children = group.findAll((g) => g.attrs.parentId === shape.attrs.id);
      const selectStyles = () => {
        shape.attr('stroke', 'rgb(50,150,250)');
        shape.attr('cursor', 'pointer');
        children.forEach((child) => {
          child.attr('cursor', 'pointer');
        });
      };
      const unSelectStyles = () => {
        shape.attr('stroke', '#ddd');
        shape.attr('cursor', 'default');
        children.forEach((child) => {
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
    }
  },
};

interface FakeObj {
  [key: string]: ShapeOptions;
}

const obj: FakeObj = {
  user, end, start, branch, condition,
};

export default obj;
