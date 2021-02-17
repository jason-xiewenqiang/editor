import G6, { ShapeOptions, ModelConfig } from '@antv/g6';

interface Point {
  x: number;
  y: number;
}

const conditionEdge: ShapeOptions = {
  getPath(points: Array<Point>) {
    const [startPoint, endPoint] = points;
    return [['M', startPoint.x, startPoint.y],
      ['L', endPoint.x, startPoint.y],
      ['L', endPoint.x, endPoint.y],
    ];
  },
  getShapeStyle(cfg: ModelConfig) {
    const startPoint = cfg?.startPoint;
    const endPoint = cfg?.endPoint;
    const points = [startPoint, endPoint];
    const path = this.getPath(points);
    const style = G6.Util.mix({}, G6.Global.defaultEdge.style, {
      stroke: '#BBB',
      lineWidth: 1,
      path,
      startArrow: {
        path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
        d: 6,
      },
      endArrow: {
        path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
        d: 6,
      },
    }, cfg.style);
    return style;
  },
};

const plusEdge = {
  getPath(points: Array<Point>) {
    const [startPoint, endPoint] = points;
    return [['M', startPoint.x, startPoint.y - 8],
      ['L', startPoint.x, endPoint.y - 16],
      ['L', endPoint.x, endPoint.y - 16],
      ['L', endPoint.x, endPoint.y],
    ];
  },
  getShapeStyle(cfg: ModelConfig) {
    const startPoint = cfg?.startPoint;
    const endPoint = cfg?.endPoint;
    const points = [startPoint, endPoint];
    const path = this.getPath(points as Array<Point>);
    const style = G6.Util.mix({}, G6.Global.defaultEdge.style, {
      stroke: '#BBB',
      lineWidth: 1,
      path,
      startArrow: {
        path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
        d: 6,
      },
      endArrow: {
        path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
        d: 6,
      },
    }, cfg.style);
    return style;
  },
};

interface FakeObj {
  [key: string]: ShapeOptions;
}

const obj: FakeObj = {
  'c-line': conditionEdge,
  'p-line': plusEdge,
};

export default obj;
