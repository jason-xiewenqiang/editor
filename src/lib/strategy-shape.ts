import { Node } from '@antv/x6';
import { merge, cloneDeep } from 'lodash';

export declare interface FakeNode {
  [key: string]: object;
}

const attributes: FakeNode = {
  spot: {
    width: 180,
    height: 40,
    shape: 'rect',
    attrs: {
      label: {
        text: '',
        fill: '#6a6c8a',
      },
      body: {
        stroke: '#31d0c6',
        strokeWidth: 1,
        fillOpacity: 0.1,
        fill: '#31d0c6',
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
      },
      items: [
        {
          id: 'port1',
          group: 'top',
        },
        {
          id: 'port3',
          group: 'bottom',
        },
        {
          id: 'port2',
          group: 'left',
        },
        {
          id: 'port4',
          group: 'right',
        },
      ],
    },
  },
  device: {
    width: 180,
    height: 40,
    shape: 'rect',
    attrs: {
      label: {
        text: '',
        fill: '#6a6c8a',
      },
      body: {
        stroke: '#31d0c6',
        strokeWidth: 1,
        fillOpacity: 0.1,
        fill: '#31d0c6',
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
      },
      items: [
        {
          id: 'port1',
          group: 'top',
        },
        {
          id: 'port3',
          group: 'bottom',
        },
        {
          id: 'port2',
          group: 'left',
        },
        {
          id: 'port4',
          group: 'right',
        },
      ],
    },
  },
  primities: {
    width: 60,
    height: 60,
    shape: 'rect',
    attrs: {
      label: {
        text: '',
        fill: '#6a6c8a',
      },
      body: {
        stroke: '#31d0c6',
        strokeWidth: 1,
        fillOpacity: 0.1,
        fill: '#31d0c6',
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
      },
      items: [
        {
          id: 'port1',
          group: 'top',
        },
        {
          id: 'port3',
          group: 'bottom',
        },
        {
          id: 'port2',
          group: 'left',
        },
        {
          id: 'port4',
          group: 'right',
        },
      ],
    },
  },
};

export const factory = function factory(type: string, options?: Node.Metadata): Node.Metadata {
  return merge(cloneDeep(attributes[type]), cloneDeep(options));
};

export default {};
