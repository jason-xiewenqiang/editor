import { merge } from 'lodash';
import Config from './Config';

export const createNode = (type: string, data: object) => {
  const obj = JSON.parse(JSON.stringify(merge(Config.node[type], data, { type: `custom-${type}` })));
  return obj;
};

export default {};
