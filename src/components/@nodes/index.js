import G6 from '@antv/g6';
import Add from './Add';
import User from './User';
import End from './End';
import Condition from './Condition';
import Branch from './Branch';

const nodeMap = {
  'custom-add': Add.node,
  'custom-user': User.node,
  'custom-end': End.node,
  'custom-condition': Condition.node,
  'custom-branch': Branch.node,
};

// 注册 节点
export default () => {
  for (let key in nodeMap) {
    G6.registerNode(key, nodeMap[key]);
  }
};
