import G6 from '@antv/g6';

const link = {
  getPath(points) {
    const [startPoint, endPoint] = points;
    return [['M', startPoint.x, startPoint.y],
      ['L', endPoint.x, startPoint.y],
      ['L', endPoint.x, endPoint.y],
    ];
  },
  getShapeStyle(cfg) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
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

export default link;
