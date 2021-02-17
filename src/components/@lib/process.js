import EventBus from '@/util/busMgr';
import Creater from './createHelper';
import BaseConfig from '../BaseConfig';
import {
  getNodesAfterInsertNode,
  moveDownward,
  getAllLinkNodes,
  getAllPrevNodes,
  getFirstConditionNode,
  isBrancNode,
  uniqueNodes,
  getNodesBetweenTwoNode,
  getAllInEdgeNodes,
  getAllOutEdgeNodes,
} from './caclulateHelper';
import EdgeHelper from './edgeHelper';
import BaseMessage from '../../../BaseMessage';
import BaseConfirm from '../../../BaseConfirm';

class Process {
  // 记录打开属性面板时的及节点
  selectedItem = null;

  // 记录打开节点时的按钮节点
  contextMenuItem = null;

  constructor(graph, busId) {
    this.graph = graph;
    // 将 BusId 挂载在graph上 到处都可以使用了
    this.graph.busId = busId;
    this.bus = EventBus.$get(busId);
    this.initCanvas();
  }

  // 放置 点击切换节点属性和整体属性的入口
  initCanvas() {
    this.graph.on('canvas:click', (e) => {
      this.bus.$emit('canvasClick', e);
      this.bus.$emit('mousedown', e);
      this.selectedItem = null;
      this.contextMenuItem = null;
    });
    this.graph.on('edge:click', (e) => {
      this.bus.$emit('canvasClick', e);
      this.bus.$emit('mousedown', e);
      this.selectedItem = null;
      this.contextMenuItem = null;
    });
    this.graph.on('node:click', (e) => {
      if (e.target.attrs.isClose) {
        const node = this.graph.findById(e.target.attrs.parentId);
        this.remove(node);
        this.graph.refresh();
      } else {
        const group = e.item.getContainer();
        const shape = group.get('children')[0];
        if (shape.attrs.showMenu) {
          // 操作 节点--打开菜单面板
          this.bus.$emit('contextmenuClick', e);
          this.contextMenuItem = shape;
          this.graph.setItemState(e.item, 'hover', false);
        } else {
          if (shape.attrs.editable) {
            // 编辑 节点--打开属性面板
            this.bus.$emit('drawer.open', e.item);
            this.selectedItem = e.item;
          } else if (shape.attrs.name === 'condition') {
            // 添加新分支
            // 业务判断 如果是会签节点 只能存在两个结果 也就是只能有两个分支 FIXME:
            const prevNode = e.item.getInEdges()[0]._cfg.sourceNode.getInEdges()[0]._cfg.sourceNode;
            if (prevNode.getModel().key === BaseConfig.property.countersign.key) {
              BaseMessage({ type: 'warning', message: '会签节点后只允许两个分支' });
              return;
            }
            this.addByConditionButton('branch', e.item);
            this.bus.$emit('commit');
          }
          this.graph.setItemState(e.item, 'selected', false);
        }
      }
    });
  }

  // 获取graph
  getGraph() {
    return this.graph;
  }

  // 获取 graph 内部节点所有数据
  getData() {
    return this.graph.save();
  }

  /**
   * 新增节点 TODO: 抽离公共 调用和代码简化
   * @param {*} type 添加什么类型节点
   * @param {*} insertNode 插入位置的节点
   */
  add(menuItem, insertNode) {
    // 获取第一个分支节点
    const nodeType = menuItem.key;
    if (nodeType !== 'condition') {
      // 添加普通节点
      this.addGerenalNode(menuItem, insertNode);
    } else {
      // 添加分支
      const group = insertNode.getContainer();
      const shape = group.getChildren()[0];
      const isConditionNode = shape.attrs.name === 'condition';
      if (isConditionNode) {
        // 在有条件分支上添加新的一个条件分支
        this.addByConditionButton('branch', insertNode);
      } else {
        // 通过 plus 选择添加新分支
        // 业务判断 如果是在会签节点之后已经有了分支了 则不允许再添加分支了 FIXME:
        const nextNode = insertNode.getOutEdges()[0]._cfg.targetNode;
        const prevNode = insertNode.getInEdges()[0]._cfg.sourceNode;
        if (prevNode.getModel().key === BaseConfig.property.countersign.key && nextNode.getModel().name === 'condition') {
          BaseMessage({ type: 'warning', message: '会签节点后只允许添加一层嵌套分支' });
          return;
        }
        this.addByPlusButton('branch', insertNode);
      }
    }
    this.bus.$emit('commit');
  }

  // 更新节点
  update(item, model) {
    this.graph.update(item, model);
  }

  // 刷新graph
  refresh() {
    this.selectedItem && this.graph.setItemState(this.selectedItem, 'selected', false);
  }

  // 添加普通节点
  addGerenalNode(menuItem, insertNode) {
    const nodeType = menuItem.key;
    const group = insertNode.getContainer();
    const shape = group.getChildren()[0];
    const { attrs } = shape;
    const nodeX = attrs.x;
    const nodeY = attrs.y + attrs.r + BaseConfig.graph.vertivalGutter;

    // 业务判断 如果是在会签后面是不允许添加普通节点的 或者不允许在开别的分支嵌套了 FIXME:
    const beforeInsertNode = insertNode.getInEdges()[0]._cfg.sourceNode;
    if (beforeInsertNode.getModel().key === BaseConfig.property.countersign.key) {
      BaseMessage({ type: 'error', message: '会签的下一个节点是分支' });
      return;
    }

    const newNode = Creater(nodeType, { x: nodeX, y: nodeY });
    const plus = Creater('plus', { x: newNode.getX(), y: newNode.getY() + BaseConfig.graph.plusGutter });

    this.graph.addItem('node', newNode);
    this.graph.addItem('node', plus);

    // 删除连线
    const breakEdge = insertNode.getOutEdges()[0]; // 需要剪断的 edge
    const afterInsertNode = getNodesAfterInsertNode(insertNode); // 在插入节点之后的节点
    this.graph.removeItem(breakEdge);

    const downMoveGutter = newNode.getHeight() + plus.getHeight();
    const conditionGutter = newNode.getHeight() / 2 + BaseConfig.graph.vertivalGutter;

    // 下移判断 如果 下面所有节点的第一个的 y 的位置 减去 当前要添加位置都大 说明不用下移
    const firstItemY = afterInsertNode[0].getModel().y;
    if ((firstItemY - attrs.y) < downMoveGutter) {
      uniqueNodes(afterInsertNode).forEach((node) => {
        const group1 = node.getContainer();
        const shape1 = group1.getChildren()[0];
        const box = shape1.getBBox();
        const isCondition = shape1.attrs.name === 'condition';
        moveDownward({ x: box.x + box.width / 2, y: box.y + box.height / 2 + (isCondition ? conditionGutter : downMoveGutter) }, node);
      });
    }

    this.graph.addItem('edge', EdgeHelper(attrs.id, newNode.getId(), { style: { endArrow: true }, sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(newNode.getId(), plus.getId(), { style: { endArrow: false }, sourceAnchor: 2, targetAnchor: 0 }));

    // 如果 下面相邻的节点是一个 plus 要使用 plus-line 连接
    const isPlusDown = afterInsertNode[0].getModel().plusDown;
    this.graph.addItem('edge', EdgeHelper(plus.getId(), afterInsertNode[0]._cfg.id, { sourceAnchor: 2, targetAnchor: 0, type: isPlusDown ? 'plus-line' : '' }));

    // 获取真实的节点 并打开属性面板
    const currentNode = this.graph.findById(newNode.getId());
    this.graph.setItemState(currentNode, 'selected', true);
    this.selectedItem = currentNode;
    this.bus.$emit('drawer.open', currentNode);
    this.graph.refresh();
  }

  // 通过 菜单 进入添加分支
  addByPlusButton(nodeType, insertNode) {
    // 获取下一个节点 拿来判断是否是一个 分支按钮
    const nextNode = insertNode.getOutEdges()[0]._cfg.targetNode;
    const allNodes = this.graph.getNodes();
    // 如果 plus 添加分支 下一个节点是 按钮
    if (nextNode.getModel().name === 'condition') {
      this.directAction(nodeType, insertNode);
    } else {
      const hasCondition = allNodes.some(node => node.getModel().name === 'condition');
      const hasOtherNode = getAllLinkNodes(insertNode.getOutEdges()[0]).some(id => {
        const node = this.graph.findById(id);
        const model = node.getModel();
        return model.name === 'condition' || model.plusDown;
      });

      // 如果从来没有添加过 分支则直接添加 或者 往下已经没有 其它节点了
      if (!hasCondition || !hasOtherNode) {
        this.firstAction(nodeType, insertNode);
      } else {
        this.betweenAction(nodeType, insertNode);
      }
    }
    this.graph.refresh();
  }

  // 通过添加分支按钮添加分支
  addByConditionButton(nodeType, insertNode) {
    // 寻找最短路径下的 plusDown 按钮
    const allNodes = this.graph.getNodes();
    const stortestPahtPlus = allNodes.filter(node => insertNode.getModel().id === node.getModel().belong)[0];

    // 取出插入节点和 最短路径下的 plusDown 节点之间的所有节点
    const betweenNodes = getNodesBetweenTwoNode(insertNode, stortestPahtPlus);
    // 找出回路里的所有 节点

    // 回路结束之后的第一个 plusDown 节点
    const firstPlusDown = allNodes.filter(node => node.getModel().plusDown && node.getModel().belong === insertNode.getModel().id)[0];

    // 横向移动的距离
    const moveGutter = BaseConfig.graph.horizontalGutter / 2 + insertNode.getModel().getWidth() / 2;
    // 先移动 所有节点 （本层） 同时找到 最下方的节点
    let rightMax = 0;

    betweenNodes.forEach(node => {
      const model = node.getModel();
      // 移动本层的时候 回路按钮 移动只有一半
      const x = model.x - moveGutter;
      if (x > rightMax) {
        rightMax = x;
      }
      node.updatePosition({ x, y: model.y });
    });

    const outEdges = insertNode.getOutEdges();
    let allEdgeLinkNodeIds = []; // 保存 兄弟 edge 链接的 除了结束节点 的所有节点
    outEdges.forEach(edge => {
      allEdgeLinkNodeIds.push(...getAllLinkNodes(edge));
    });

    const nodesBeforeInsert = getAllInEdgeNodes(insertNode);
    const conditionSplusDown = allNodes.filter(node => node.getModel().plusDown && node.getModel().belong === insertNode.getModel().id)[0];
    const nodesAfterPlusDown = uniqueNodes([this.graph.findById(this.graph.endNodeId)].concat(getNodesBetweenTwoNode(conditionSplusDown, this.graph.findById(this.graph.endNodeId))));

    allNodes.forEach(node => {
      const model = node.getModel();
      const isOtherNode = betweenNodes.map(n => n.getModel().id).indexOf(model.id) === -1 && nodesBeforeInsert.map(n => n.getModel().id).indexOf(model.id) === -1 && nodesAfterPlusDown.map(n => n.getModel().id).indexOf(model.id) === -1;
      if (isOtherNode) {
        // 右侧
        const isRight = model.x > insertNode.getModel().x;
        if (isRight) {
          // 移动时候 回路按钮 移动只有一半
          const x = model.x + (moveGutter / (model.x === insertNode.getModel().x || model.plusDown ? 2 : 1));
          node.updatePosition({ x, y: model.y });
        }

        // 左侧
        const isLeft = model.x < insertNode.getModel().x;
        if (isLeft) {
          // 移动时候 回路按钮 移动只有一半
          const x = model.x - (moveGutter / (model.x === insertNode.getModel().x || model.plusDown ? 2 : 1));
          node.updatePosition({ x, y: model.y });
        }
      }
    });
    const branch = Creater('branch', {
      x: rightMax + 30 + BaseConfig.graph.nodeWdith / 2,
      y: insertNode.getModel().y + insertNode.getModel().getHeight() / 2 + BaseConfig.graph.vertivalGutter,
    });

    const plus = Creater('plus', {
      x: branch.getX(),
      y: branch.getY() + BaseConfig.graph.plusGutter,
    });


    this.graph.addItem('node', branch);
    this.graph.addItem('node', plus);

    this.graph.addItem('edge', EdgeHelper(insertNode.getModel().id, branch.getId(), {
      type: 'condition-line', sourceAnchor: 2, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(branch.getId(), plus.getId(), { sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(plus.getId(), firstPlusDown.getModel().id, {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));

    this.graph.refresh();
  }

  // 如果 plus 添加分支 下一个节点是 添加分支按钮 的添加逻辑
  directAction(nodeType, insertNode) {
    // 获取下一个节点 拿来判断是否是一个 分支按钮
    const nextNode = insertNode.getOutEdges()[0]._cfg.targetNode;
    const group = insertNode.getContainer();
    const shape = group.getChildren()[0];
    const allNodes = this.graph.getNodes();

    // 寻找最短路径下的 plusDown 按钮
    const stortestPahtPlus = allNodes.filter(node => nextNode.getModel().id === node.getModel().belong)[0];

    // 获取当前 plus 下的所有节点 包括结束节点 都要往下移动和向左移动
    const allLinkDownIds = getAllLinkNodes(insertNode.getOutEdges()[0]);
    const afterStortestPahtPlus = allLinkDownIds.filter(id => {
      const node = this.graph.findById(id);
      const model = node.getModel();
      return model.y > stortestPahtPlus.getModel().y;
    });
    const { attrs } = shape;
    const vGutter = attrs.r + BaseConfig.graph.vertivalGutter / 2 + BaseConfig.graph.plusGutter * 2 + BaseConfig.node.condition.size[1] / 2; // 垂直移动的距离
    const hGutter = BaseConfig.graph.horizontalGutter / 2 + BaseConfig.node.condition.size[0] / 2; // 水平移动的距离
    allLinkDownIds.forEach(id => {
      const node = this.graph.findById(id);
      const model = node.getModel();
      // 下移动的时候 结束节点 x 不动
      node.updatePosition({ x: model.x - (id === this.graph.endNodeId || afterStortestPahtPlus.indexOf(model.id) !== -1 ? 0 : hGutter), y: model.y + vGutter });
    });

    // 如果是在 最短路径下的 plusDown 按钮后面的节点，必须往下多移动一段距离
    afterStortestPahtPlus.forEach(id => {
      const node = this.graph.findById(id);
      const model = node.getModel();
      // 下移动的时候 结束节点 x 不动
      node.updatePosition({ x: model.x, y: model.y + attrs.r + BaseConfig.graph.plusGutter });
    });

    // 切断 edge 前
    // 切断 原来的 edge
    const breakEdge = insertNode.getOutEdges()[0]; // 需要剪断的 edge
    const afterInsertNode = getNodesAfterInsertNode(insertNode); // 在插入节点之后的节点
    this.graph.removeItem(breakEdge);

    // 切断回路最后的连线 以及记录 连线的节点 后
    const afterPlusNode = stortestPahtPlus.getOutEdges()[0]._cfg.targetNode;
    this.graph.removeItem(stortestPahtPlus.getOutEdges()[0]);

    // 构建 node
    const nodeX = attrs.x;
    const nodeY = attrs.y + attrs.r + BaseConfig.graph.vertivalGutter / 2;
    const conditionButton = Creater('condition', {
      x: nodeX,
      y: nodeY,
    });

    // 获取 第一个分支前节点和 结束节点 （不需要移动的节点的 id 集合）
    // 如果是在中间的 plus 插入节点
    const lastNode = insertNode.getInEdges()[0]._cfg.sourceNode;
    const isBranch = isBrancNode(lastNode);
    const firstCondition = getFirstConditionNode(insertNode);
    const firstConditionId = isBranch ? firstCondition.getModel().id : nextNode.getModel().id;

    const notNeededMoveMap = [this.graph.startNodeId, this.graph.endNodeId, firstConditionId];
    const notNeededNodes = getAllPrevNodes(this.graph.findById(firstConditionId));
    notNeededNodes.forEach(node => {
      const model = node.getModel();
      if (notNeededMoveMap.indexOf(model.id) === -1) {
        notNeededMoveMap.push(model.id);
      }
    });

    const sameEdgeLinkNodes = getAllInEdgeNodes(insertNode);
    // 计算中心线上
    allNodes.forEach(node => {
      const model = node.getModel();
      const isRight = model.x > attrs.x && notNeededMoveMap.indexOf(model.id) === -1 && allLinkDownIds.indexOf(model.id) === -1 && sameEdgeLinkNodes.map(n => n.getModel().id).indexOf(model.id) === -1;
      // 右边部分 == x 要加上 hGutter
      if (isRight) {
        node.updatePosition({ x: model.x + hGutter, y: model.y });
      }
      // 左边 部分 （除了本层已经移动过的 以及不需要移动的节点）
      const isLeft = model.x < attrs.x && notNeededMoveMap.indexOf(model.id) === -1 && allLinkDownIds.indexOf(model.id) === -1 && sameEdgeLinkNodes.map(n => n.getModel().id).indexOf(model.id) === -1;
      if (isLeft) {
        node.updatePosition({ x: model.x - hGutter, y: model.y });
      }
    });

    // 找到中心线最左的点
    let linkNodeLeftest; // 获取到移动部分 -- 移动后最左边的位置就是 新添加的节点的位置

    allLinkDownIds.forEach(id => {
      if (linkNodeLeftest) {
        const node = this.graph.findById(id);
        const xLeftest = linkNodeLeftest.getModel().x;
        const newLeft = node.getModel().x;
        // 如果新的 x 要小于之前的 说明 这个节点在 更左
        if (newLeft < xLeftest) {
          linkNodeLeftest = node;
        }
      } else {
        linkNodeLeftest = this.graph.findById(id);
      }
    });

    const newNodeRight = Creater(nodeType, {
      x: 2 * nodeX - linkNodeLeftest.getModel().x,
      y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
    });
    const plusRight = Creater('plus', {
      x: newNodeRight.getX(),
      y: newNodeRight.getY() + BaseConfig.graph.plusGutter,
    });
    // 左边部分
    const newNodeLeft = Creater(nodeType, {
      x: conditionButton.getX() - conditionButton.getWidth() / 2 - BaseConfig.graph.horizontalGutter / 2,
      y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
    });
    const plusLeft = Creater('plus', {
      x: newNodeLeft.getX(),
      y: newNodeLeft.getY() + BaseConfig.graph.plusGutter,
    });
    const plusDown = Creater('plus', {
      x: nodeX,
      y: stortestPahtPlus.getModel().y + plusLeft.getHeight() / 2 + BaseConfig.graph.plusGutter,
    });
    plusDown.plusDown = true;
    plusDown.belong = conditionButton.getId();
    this.graph.addItem('node', conditionButton);
    this.graph.addItem('node', newNodeRight);
    this.graph.addItem('node', newNodeLeft);
    this.graph.addItem('node', plusRight);
    this.graph.addItem('node', plusLeft);
    this.graph.addItem('node', plusDown);

    // 处理连线
    this.graph.addItem('edge', EdgeHelper(attrs.id, conditionButton.getId(), { sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(conditionButton.getId(), newNodeRight.getId(), {
      type: 'condition-line', sourceAnchor: 2, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(conditionButton.getId(), newNodeLeft.getId(), {
      type: 'condition-line', sourceAnchor: 2, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(newNodeRight.getId(), plusRight.getId(), { sourceAnchor: 2, targetAnchor: 0 }));

    this.graph.addItem('edge', EdgeHelper(newNodeLeft.getId(), plusLeft.getId(), { sourceAnchor: 2, targetAnchor: 0 }));

    this.graph.addItem('edge', EdgeHelper(plusRight.getId(), plusDown.getId(), {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(stortestPahtPlus.getModel().id, plusDown.getId(), {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));

    this.graph.addItem('edge', EdgeHelper(plusLeft.getId(), afterInsertNode[0]._cfg.id, { sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(plusDown.getId(), afterPlusNode.getModel().id, {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));
  }

  // 如果从来没有添加过 分支则直接添加 或者 往下已经没有 其它节点 的 添加逻辑
  firstAction(nodeType, insertNode) {
    const group = insertNode.getContainer();
    const shape = group.getChildren()[0];

    const { attrs } = shape;
    const nodeX = attrs.x;
    const nodeY = attrs.y + attrs.r + BaseConfig.graph.vertivalGutter / 2;

    const conditionButton = Creater('condition', {
      x: nodeX,
      y: nodeY,
    });
    /**
     * 从来没有添加过分支节点 按以下步骤添加
     * 1. 获取插入位置信息 insertNode
     * 2. 构建新的节点
     * 3. 断开原 连线
     * 4. 插入节点 同时下移 结束节点
     * 5. 刷新 graph
     */
    // 业务判断 新增分支时 如果添加在会签后面 则要改写原有参数 同时不允许编辑面板 FIXME:
    const prevNodeModel = insertNode.getInEdges()[0]._cfg.sourceNode.getModel();
    const isCountersign = prevNodeModel.key === BaseConfig.property.countersign.key;
    let rightConfig;
    let leftConfig;
    if (isCountersign) {
      rightConfig = {
        name: '通过',
        side: 'right',
        rule: prevNodeModel.signType && prevNodeModel.signTypeMap[prevNodeModel.signType].split('&&')[0],
        x: conditionButton.getX() + conditionButton.getWidth() / 2 + BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
      leftConfig = {
        name: '不通过',
        side: 'left',
        rule: prevNodeModel.signType && prevNodeModel.signTypeMap[prevNodeModel.signType].split('&&')[1],
        x: conditionButton.getX() - conditionButton.getWidth() / 2 - BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
    } else {
      rightConfig = {
        x: conditionButton.getX() + conditionButton.getWidth() / 2 + BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
      leftConfig = {
        x: conditionButton.getX() - conditionButton.getWidth() / 2 - BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
    }
    const newNodeRight = Creater(nodeType, rightConfig);
    const plusRight = Creater('plus', {
      x: newNodeRight.getX(),
      y: newNodeRight.getY() + BaseConfig.graph.plusGutter,
    });
    const newNodeLeft = Creater(nodeType, leftConfig);
    const plusLeft = Creater('plus', {
      x: newNodeLeft.getX(),
      y: newNodeLeft.getY() + BaseConfig.graph.plusGutter,
    });
    const plusDown = Creater('plus', {
      x: nodeX,
      y: plusLeft.getY() + plusLeft.getHeight() / 2 + BaseConfig.graph.plusGutter,
    });

    // 标记 plusDown
    plusDown.plusDown = true;
    // 设置它的归属
    plusDown.belong = conditionButton.getId();
    this.graph.addItem('node', conditionButton);
    this.graph.addItem('node', newNodeRight);
    this.graph.addItem('node', newNodeLeft);
    this.graph.addItem('node', plusRight);
    this.graph.addItem('node', plusLeft);
    this.graph.addItem('node', plusDown);
    // 删除连线
    const breakEdge = insertNode.getOutEdges()[0]; // 需要剪断的 edge
    const afterInsertNode = getNodesAfterInsertNode(insertNode); // 在插入节点之后的节点
    this.graph.removeItem(breakEdge);

    afterInsertNode.forEach((node) => {
      const group1 = node.getContainer();
      const shape1 = group1.getChildren()[0];
      const box = shape1.getBBox();
      moveDownward({ x: box.x + box.width / 2, y: box.y + box.height / 2 + newNodeRight.getHeight() / 2 + plusRight.getHeight() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter + BaseConfig.graph.plusGutter * 2 }, node);
    });

    this.graph.addItem('edge', EdgeHelper(attrs.id, conditionButton.getId(), { sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(conditionButton.getId(), newNodeRight.getId(), {
      type: 'condition-line', sourceAnchor: 1, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(conditionButton.getId(), newNodeLeft.getId(), {
      type: 'condition-line', sourceAnchor: 3, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(newNodeRight.getId(), plusRight.getId(), { sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(newNodeLeft.getId(), plusLeft.getId(), { sourceAnchor: 2, targetAnchor: 0 }));

    this.graph.addItem('edge', EdgeHelper(plusRight.getId(), plusDown.getId(), {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(plusLeft.getId(), plusDown.getId(), {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));

    // afterInsertNode 根据 节点类型是否需要显示 箭头
    this.graph.addItem('edge', EdgeHelper(plusDown.getId(), afterInsertNode[0]._cfg.id, { sourceAnchor: 2, targetAnchor: 0 }));
  }

  // 在中间位置添加 分支
  betweenAction(nodeType, insertNode) {
    const group = insertNode.getContainer();
    const shape = group.getChildren()[0];
    const allNodes = this.graph.getNodes();
    const { attrs } = shape;
    const nodeX = attrs.x;
    const nodeY = attrs.y + attrs.r + BaseConfig.graph.vertivalGutter / 2;

    const conditionButton = Creater('condition', { x: nodeX, y: nodeY });

    // 获取 第一个分支前节点和 结束节点 （不需要移动的节点的 id 集合）
    const firstCondition = getFirstConditionNode(insertNode);
    const notNeededMoveMap = [this.graph.startNodeId, this.graph.endNodeId];
    const notNeededNodes = [];
    if (firstCondition) {
      notNeededMoveMap.push(firstCondition.getModel().id);
      notNeededNodes.push(...getAllPrevNodes(this.graph.findById(firstCondition.getModel().id)));
      notNeededNodes.forEach(node => {
        const model = node.getModel();
        if (notNeededMoveMap.indexOf(model.id) === -1) {
          notNeededMoveMap.push(model.id);
        }
      });
    }

    // 先移动 整体 把插入的地方给出来
    // 判断标准 判断轴线 当前轴线的 x 不动 以及第一个分支按钮以上 和 结束节点不动
    // 移动时 在和点击位置的节点 同一条线上的节点不移动
    const sameEdgeLinkNodes = [...getAllInEdgeNodes(insertNode), ...getAllOutEdgeNodes(insertNode)];
    // console.log('sameEdgeLinkNodes ', sameEdgeLinkNodes);
    const currentInsetX = insertNode.getModel().x;
    // 插入节点的所有左边节点
    const insertLeftNodes = allNodes.filter(node => {
      const model = node.getModel();
      return model.x < currentInsetX && notNeededMoveMap.indexOf(model.id) === -1 && sameEdgeLinkNodes.map(n => n.getModel().id).indexOf(model.id) === -1;
    });
    // 插入节点的所有右边 - 除了第一个分支前节点和 结束节点
    const insertRightNodes = allNodes.filter(node => {
      const model = node.getModel();
      return model.x > currentInsetX && notNeededMoveMap.indexOf(model.id) === -1 && sameEdgeLinkNodes.map(n => n.getModel().id).indexOf(model.id) === -1;
    });
    // 横向移动的距离
    const moveGutter = BaseConfig.graph.horizontalGutter / 2 + conditionButton.getWidth() / 2;

    if (!insertNode.getModel().plusDown) { // 如果不是在用户节点下添加的分支统统不需要上层的分支节点横向移动
      insertLeftNodes.forEach(node => {
        const model = node.getModel();
        node.updatePosition({ x: model.x - moveGutter, y: model.y });
      });
      insertRightNodes.forEach(node => {
        const model = node.getModel();
        node.updatePosition({ x: model.x + moveGutter, y: model.y });
      });
    }

    // 切断 原来的 edge
    const breakEdge = insertNode.getOutEdges()[0];

    // 在插入节点之后的节点
    const afterInsertNode = getNodesAfterInsertNode(insertNode);
    this.graph.removeItem(breakEdge);

    // 业务判断 新增分支时 如果添加在会签后面 则要改写原有参数 同时不允许编辑面板 FIXME:
    const prevNodeModel = insertNode.getInEdges()[0]._cfg.sourceNode.getModel();
    const isCountersign = prevNodeModel.key === BaseConfig.property.countersign.key;
    let rightConfig;
    let leftConfig;
    if (isCountersign) {
      rightConfig = {
        name: '通过',
        rule: prevNodeModel.signType && prevNodeModel.signTypeMap[prevNodeModel.signType].split(' && ')[0],
        x: conditionButton.getX() + conditionButton.getWidth() / 2 + BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
      leftConfig = {
        name: '不通过',
        rule: prevNodeModel.signType && prevNodeModel.signTypeMap[prevNodeModel.signType].split(' && ')[1],
        x: conditionButton.getX() - conditionButton.getWidth() / 2 - BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
    } else {
      rightConfig = {
        x: conditionButton.getX() + conditionButton.getWidth() / 2 + BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
      leftConfig = {
        x: conditionButton.getX() - conditionButton.getWidth() / 2 - BaseConfig.graph.horizontalGutter / 2,
        y: conditionButton.getY() + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter,
      };
    }
    const newNodeRight = Creater(nodeType, rightConfig);
    const plusRight = Creater('plus', {
      x: newNodeRight.getX(),
      y: newNodeRight.getY() + BaseConfig.graph.plusGutter,
    });
    const newNodeLeft = Creater(nodeType, leftConfig);
    const plusLeft = Creater('plus', { x: newNodeLeft.getX(), y: newNodeLeft.getY() + BaseConfig.graph.plusGutter });

    const plusDown = Creater('plus', { x: nodeX, y: plusLeft.getY() + plusLeft.getHeight() / 2 + BaseConfig.graph.plusGutter });

    plusDown.plusDown = true;

    // 下移距离
    let downMoveGutter = newNodeRight.getHeight() / 2 + plusRight.getHeight() / 2 + conditionButton.getHeight() / 2 + BaseConfig.graph.vertivalGutter + BaseConfig.graph.plusGutter * 2;
    let downMoveGutter1 = newNodeRight.getHeight() / 2 + plusRight.getHeight() / 2 + BaseConfig.graph.vertivalGutter + BaseConfig.graph.plusGutter * 2;

    const space = afterInsertNode[0].getModel().y - attrs.y;
    // 要动态给定下移差距
    const needMoveDown = space < downMoveGutter;
    uniqueNodes(afterInsertNode).forEach((node) => {
      const group1 = node.getContainer();
      const shape1 = group1.getChildren()[0];
      const box = shape1.getBBox();
      let gutter;
      if (node.getModel().name === 'condition') {
        gutter = downMoveGutter1 - space + plusRight.getHeight() / 2 + BaseConfig.graph.plusGutter;
      } else {
        gutter = downMoveGutter - space + plusRight.getHeight() / 2 + BaseConfig.graph.plusGutter;
      }
      // 下移判断 如果 空间足够 不需要下移
      needMoveDown && moveDownward({ x: box.x + box.width / 2, y: box.y + box.height / 2 + (needMoveDown ? gutter : 0) }, node);
    });

    // 设置它的归属
    plusDown.plusDown = true;
    plusDown.belong = conditionButton.getId();
    this.graph.addItem('node', conditionButton);
    this.graph.addItem('node', newNodeRight);
    this.graph.addItem('node', newNodeLeft);
    this.graph.addItem('node', plusRight);
    this.graph.addItem('node', plusLeft);
    this.graph.addItem('node', plusDown);

    this.graph.addItem('edge', EdgeHelper(attrs.id, conditionButton.getId(), { sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(conditionButton.getId(), newNodeRight.getId(), {
      type: 'condition-line', sourceAnchor: 1, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(conditionButton.getId(), newNodeLeft.getId(), {
      type: 'condition-line', sourceAnchor: 3, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(newNodeRight.getId(), plusRight.getId(), { sourceAnchor: 2, targetAnchor: 0 }));
    this.graph.addItem('edge', EdgeHelper(newNodeLeft.getId(), plusLeft.getId(), { sourceAnchor: 2, targetAnchor: 0 }));

    this.graph.addItem('edge', EdgeHelper(plusRight.getId(), plusDown.getId(), {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));
    this.graph.addItem('edge', EdgeHelper(plusLeft.getId(), plusDown.getId(), {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));

    this.graph.addItem('edge', EdgeHelper(plusDown.getId(), afterInsertNode[0]._cfg.id, {
      type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
    }));
  }

  // 删除节点
  remove(item) {
    const model = item.getModel();
    BaseConfirm({
      title: '确认删除',
      content: `请确认是否删除 ${model.name}？`,
    }).then((validate) => {
      if (validate) {
        // 开始节点不允许删除
        if (model.key === 'START') return;
        switch (model.key) {
          case 'BRANCH':
            this.removeBranchNode(item);
            break;
          default:
            this.removeUserNode(item);
            break;
        }
        this.bus.$emit('commit');
      }
    });
  }

  /** 删除普通节点
   * ① 获取删除的前后关联节点
   * ② 移除 节点（一个用户节点和一个 Plus 节点）
   * ③ 连接删除前的节点
   * ④ 判断是否需要移动下面的节点 （空间位置）
   * ⑤ 刷新视图
   * @param {*} item 点击删除的用户节点
   */
  removeUserNode(item) {
    const model = item.getModel();
    const allNodes = this.graph.getNodes();
    const beforeNode = item.getInEdges()[0]._cfg.sourceNode;
    const nextNode = item.getOutEdges()[0]._cfg.targetNode;
    const afterNextNode = nextNode.getOutEdges()[0]._cfg.targetNode;

    let moveNodes;

    // 判断是否在分支内部
    const beforeDelNodes = getAllInEdgeNodes(item);
    // 说明是处于分支内部的
    if (beforeDelNodes.some(nd => nd.getModel().name === 'condition')) {
      // 找到删除节点所在的分支回路
      const conditionNodes = beforeDelNodes.filter(n => n.getModel().name === 'condition');
      let belongLoopCondition;
      let plusDown;
      for (let i = 0; i < conditionNodes.length; i++) {
        const dnode = conditionNodes[i];
        const pd = allNodes.filter(n => n.getModel().plusDown && n.getModel().belong === dnode.getModel().id)[0];
        const betweenNodes = getNodesBetweenTwoNode(dnode, pd);
        if (betweenNodes.some(n => n.getModel().id === item.getModel().id)) {
          belongLoopCondition = dnode;
          plusDown = pd;
          break;
        }
      }
      if (belongLoopCondition && plusDown) {
        this.graph.removeItem(item);
        this.graph.removeItem(nextNode);
        this.graph.addItem('edge', EdgeHelper(beforeNode.getModel().id, afterNextNode.getModel().id, {
          type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
        }));

        // 先处理本分支内部的节点 如果有就处理 没有就不进行操作 要有其它的节点才处理
        if (afterNextNode.getModel().id !== plusDown.getModel().id) {
          const moveFirstNodes = getNodesBetweenTwoNode(afterNextNode, plusDown);
          [afterNextNode, ...moveFirstNodes].forEach(node => {
            const nodeModel = node.getModel();
            node.updatePosition({ x: nodeModel.x, y: nodeModel.y - (model.getHeight() / 2 + plusDown.getModel().getHeight() + BaseConfig.graph.plusGutter) });
          });
        }

        const inPlusDownNodes = plusDown.getInEdges().map(edge => edge._cfg.sourceNode);
        let lowestNode;
        inPlusDownNodes.forEach(nd => {
          if (lowestNode) {
            if (lowestNode.getModel().y < nd.getModel().y) {
              lowestNode = nd;
            }
          } else {
            lowestNode = nd;
          }
        });
        const gutter = model.getHeight() / 2 + lowestNode.getModel().getHeight() + BaseConfig.graph.plusGutter;
        if (lowestNode && (plusDown.getModel().y - lowestNode.getModel().y) > gutter) {
          moveNodes = getAllOutEdgeNodes(lowestNode);
          // 向上移动
          moveNodes.forEach(node => {
            const mod = node.getModel();
            node.updatePosition({ x: mod.x, y: mod.y - gutter });
          });
        }
      } else {
        moveNodes = getAllOutEdgeNodes(nextNode);
        // 向上移动
        const gutter = model.getHeight() / 2 + nextNode.getModel().getHeight() + BaseConfig.graph.plusGutter;
        moveNodes.forEach(node => {
          const mod = node.getModel();
          node.updatePosition({ x: mod.x, y: mod.y - gutter });
        });
        this.graph.removeItem(item);
        this.graph.removeItem(nextNode);
        this.graph.addItem('edge', EdgeHelper(beforeNode.getModel().id, afterNextNode.getModel().id, {
          type: 'plus-line', sourceAnchor: 2, targetAnchor: 0,
        }));
      }
    } else {
      moveNodes = getAllOutEdgeNodes(nextNode);
      // 向上移动
      const gutter = model.getHeight() / 2 + nextNode.getModel().getHeight() + BaseConfig.graph.plusGutter;
      moveNodes.forEach(node => {
        const mod = node.getModel();
        node.updatePosition({ x: mod.x, y: mod.y - gutter });
      });
      this.graph.removeItem(item);
      this.graph.removeItem(nextNode);
      this.graph.addItem('edge', EdgeHelper(beforeNode.getModel().id, afterNextNode.getModel().id, {
        type: 'plus-line', style: { endArrow: false, startArrow: false }, sourceAnchor: 2, targetAnchor: 0,
      }));
    }

    this.graph.refresh();
  }

  /** 删除分支
   * ① 获取分支的 Condition 按钮 同时拿到分支（out-edge）数量 以及属于他的 PlusDown 按钮
   * ② 判断分支数量 如果等于 2 则需要删除整个 回路
   * ③ 记录删除位置前后的关联节点
   * ④ 删除目标分支
   * ⑤ 连接删后的位置的 前后关联节点
   * ⑥ 判断是否需要移动下面的节点
   * ⑦ 更新视图
   * @param {*} item 点击删除的分支节点
   */
  removeBranchNode(item) {
    const model = item.getModel();
    const conditionButton = item.getInEdges()[0]._cfg.sourceNode;
    const conditionButtonWidth = conditionButton.getModel().getWidth();
    const edgeCount = conditionButton.getOutEdges().length;
    const allNodes = this.graph.getNodes();
    const plusDown = allNodes.filter(node => node.getModel().plusDown && node.getModel().belong === conditionButton.getModel().id)[0];
    // 如果是只有两个分支了 那么就要将分支拆解
    if (edgeCount > 2) {
      const needDelNodes = [item, ...getNodesBetweenTwoNode(item, plusDown)];
      const needMoveNodes = getNodesBetweenTwoNode(conditionButton, plusDown).filter(node => {
        const nodeModel = node.getModel();
        return !needDelNodes.some(n => n.getModel().id === nodeModel.id);
      });
      // const removePosition = model.x === conditionButton.getModel().x ? 'middle' : model.x > conditionButton.getModel().x ? 'right' : 'left';
      // 判断删除的节点中是否有 分支节点
      const hasConditionNode = needDelNodes.some(node => node.getModel().name === 'condition');
      let maxEdge = 0;
      if (hasConditionNode) {
        needDelNodes.forEach(node => {
          const nodeModel = node.getModel();
          if (nodeModel.name === 'condition') {
            const length = node.getOutEdges().length;
            if (length > maxEdge) {
              maxEdge = length;
            }
          }
        });
      }

      let gutter = BaseConfig.graph.horizontalGutter / 2 + conditionButton.getModel().getWidth() / 2;
      let lowestNode = null;

      // 获取最左节点和最右节点
      let leftestNode;
      let rightestNode;
      conditionButton.getOutEdges().forEach(edge => {
        const node = edge._cfg.targetNode;
        const nodeModel = node.getModel();
        if (leftestNode) {
          if (leftestNode.getModel().x - nodeModel.x > 0) {
            leftestNode = node;
          }
        } else {
          leftestNode = node;
        }
        if (rightestNode) {
          if (rightestNode.getModel().x - nodeModel.x < 0) {
            rightestNode = node;
          }
        } else {
          rightestNode = node;
        }
      });

      needMoveNodes.forEach(node => {
        const nodeModel = node.getModel();
        const removePosition = model.x === leftestNode.getModel().x ? 'left' : model.x === rightestNode.getModel().x ? 'right' : 'middle';
        switch (removePosition) {
          case 'right':
            if (hasConditionNode) {
              // let isLeft = (nodeModel.x - conditionButton.getModel().x) < 0;
              // node.updatePosition({ x: isLeft ? nodeModel.x + gutter * maxEdge : nodeModel.x - gutter * maxEdge, y: nodeModel.y });
              node.updatePosition({ x: nodeModel.x + gutter * maxEdge, y: nodeModel.y });
            } else {
              node.updatePosition({ x: nodeModel.x + gutter, y: nodeModel.y });
            }
            break;
          case 'left':
            if (hasConditionNode) {
              // let isLeft = (nodeModel.x - conditionButton.getModel().x) < 0;
              // node.updatePosition({ x: isLeft ? nodeModel.x + gutter * maxEdge : nodeModel.x - gutter * maxEdge, y: nodeModel.y });
              node.updatePosition({ x: nodeModel.x - gutter * maxEdge, y: nodeModel.y });
            } else {
              node.updatePosition({ x: nodeModel.x - gutter, y: nodeModel.y });
            }
            break;
          default:
            if (hasConditionNode) {
              let isLeft = (nodeModel.x - conditionButton.getModel().x) <= 0;
              node.updatePosition({ x: isLeft ? nodeModel.x + gutter * maxEdge : nodeModel.x - gutter * maxEdge, y: nodeModel.y });
            } else {
              // eslint-disable-next-line no-case-declarations
              let isLeft = (conditionButton.getModel().x - nodeModel.x) > 0;
              node.updatePosition({ x: isLeft ? nodeModel.x + gutter : nodeModel.x - gutter, y: nodeModel.y });
            }
            break;
        }
        if (lowestNode) {
          if (lowestNode.getModel().y < nodeModel.y) {
            lowestNode = node;
          }
        } else {
          lowestNode = node;
        }
      });
      needDelNodes.forEach(node => this.graph.removeItem(node));

      // 其它需要移动的分支 计算
      const prevNodes = getAllInEdgeNodes(conditionButton);
      const nextNodes = getAllOutEdgeNodes(conditionButton);
      allNodes.forEach(node => {
        const nodeModel = node.getModel();
        if (prevNodes.every(nd => nd.getModel().id !== nodeModel.id) && nextNodes.every(nd => nd.getModel().id !== nodeModel.id)) {
          const onLeft = nodeModel.x < conditionButton.getModel().x;
          const onRight = nodeModel.x > conditionButton.getModel().x;
          if (onLeft) {
            node.updatePosition({ x: nodeModel.x + gutter, y: nodeModel.y });
          }
          if (onRight) {
            node.updatePosition({ x: nodeModel.x - gutter, y: nodeModel.y });
          }
        }
      });

      // 缩小间距  动态计算才行
      const moveGutter = (plusDown.getModel().y - lowestNode.getModel().y);
      if (plusDown.getModel().y - lowestNode.getModel().y > BaseConfig.graph.plusGutter) {
        const needMoveUpNodes = [plusDown, ...getAllOutEdgeNodes(plusDown)];
        needMoveUpNodes.forEach(node => {
          const nodeModel = node.getModel();
          node.updatePosition({ x: nodeModel.x, y: nodeModel.y - moveGutter + model.getHeight() / 2 + BaseConfig.graph.plusGutter / 2 });
        });
      }
    } else {
      // 拆解分支 获取移动的条件
      // console.log('拆解分支 获取移动的条件');
      const nodeBeforeCondition = conditionButton.getInEdges()[0]._cfg.sourceNode;
      const nodeAfterPlusDown = plusDown.getOutEdges()[0]._cfg.targetNode;
      const otherBranchNodes = []; // 需要清除的分支节点
      conditionButton.getOutEdges().forEach(edge => {
        const targetNode = edge._cfg.targetNode;
        if (targetNode.getModel().id !== model.id) {
          otherBranchNodes.push(targetNode, targetNode.getOutEdges()[0]._cfg.targetNode);
        }
      });
      const needDelNodes = [item, conditionButton, plusDown, ...getNodesBetweenTwoNode(item, plusDown), ...otherBranchNodes];
      const needMoveNodes = getNodesBetweenTwoNode(conditionButton, plusDown).filter(node => {
        const nodeModel = node.getModel();
        return !needDelNodes.some(n => n.getModel().id === nodeModel.id);
      });

      // const hgutter = BaseConfig.graph.horizontalGutter / 2 + conditionButton.getModel().getWidth() / 2;
      // const vgutter = model.getHeight() / 2 + plusDown.getModel().getHeight() / 2 + conditionButton.getModel().getHeight() / 2 + BaseConfig.graph.vertivalGutter + BaseConfig.graph.plusGutter;
      // needMoveNodes.forEach(node => {
      //   const nodeModel = node.getModel();
      //   node.updatePosition({ x: nodeModel.x + hgutter, y: nodeModel.y - vgutter });
      // });
      [...needDelNodes, ...needMoveNodes].forEach(node => this.graph.removeItem(node));
      this.graph.addItem('edge', EdgeHelper(nodeBeforeCondition.getModel().id, nodeAfterPlusDown.getModel().id, {
        type: 'plus-line', style: { endArrow: false, startArrow: false }, sourceAnchor: 2, targetAnchor: 0,
      }));
      // let lowestNode;
      // if (needMoveNodes.length) {
      //   needMoveNodes.forEach(node => {
      //     const nodeModel = node.getModel();
      //     if (lowestNode) {
      //       if (nodeModel.y > lowestNode.getModel().y) {
      //         lowestNode = node;
      //       }
      //     } else {
      //       lowestNode = node;
      //     }
      //   });
      //   this.graph.addItem('edge', EdgeHelper(nodeBeforeCondition.getModel().id, nodeAfterPlusDown.getModel().id, {
      //     type: 'plus-line', style: { endArrow: false, startArrow: false }, sourceAnchor: 2, targetAnchor: 0,
      //   }));
      // } else {
      //   this.graph.addItem('edge', EdgeHelper(nodeBeforeCondition.getModel().id, nodeAfterPlusDown.getModel().id, {
      //     type: 'plus-line', style: { endArrow: false, startArrow: false }, sourceAnchor: 2, targetAnchor: 0,
      //   }));
      // }

      // 移动 判断上下距离 判断左右移动
      // 第一种情况 已经没有别的分支了 只需要找到连线之下的节点
      const isOneBranch = allNodes.filter(node => node.getModel().name === 'condition').length === 0;
      if (isOneBranch) {
        const moveUpNodes = [nodeAfterPlusDown, ...getAllOutEdgeNodes(nodeAfterPlusDown)];
        const space = nodeAfterPlusDown.getModel().y - nodeBeforeCondition.getModel().y;
        if (space > BaseConfig.graph.plusGutter) {
          moveUpNodes.forEach(node => {
            const nodeModel = node.getModel();
            node.updatePosition({ x: nodeModel.x, y: nodeModel.y - space + model.getHeight() / 2 + BaseConfig.graph.plusGutter / 2 });
          });
        }
        // if (lowestNode) {
        //   const space = nodeAfterPlusDown.getModel().y - lowestNode.getModel().y;
        //   if (space > BaseConfig.graph.plusGutter) {
        //     moveUpNodes.forEach(node => {
        //       const nodeModel = node.getModel();
        //       node.updatePosition({ x: nodeModel.x, y: nodeModel.y - space + model.getHeight() / 2 + BaseConfig.graph.plusGutter / 2 });
        //     });
        //   }
        // } else {
        //   const space = nodeAfterPlusDown.getModel().y - nodeBeforeCondition.getModel().y;
        //   if (space > BaseConfig.graph.plusGutter) {
        //     moveUpNodes.forEach(node => {
        //       const nodeModel = node.getModel();
        //       node.updatePosition({ x: nodeModel.x, y: nodeModel.y - space + model.getHeight() / 2 + BaseConfig.graph.plusGutter / 2 });
        //     });
        //   }
        // }
      } else { // 还存在别的分支
        // 先处理中间节点

        const beforeConnectNodes = getAllInEdgeNodes(nodeBeforeCondition);
        const afterConnectNodes = getAllOutEdgeNodes(nodeAfterPlusDown);
        const notNeededMoveMap = [nodeBeforeCondition, nodeAfterPlusDown, ...beforeConnectNodes, ...afterConnectNodes];
        // 左右移动
        allNodes.filter(node => {
          const nodeModel = node.getModel();
          return notNeededMoveMap.every(n => n.getModel().id !== nodeModel.id);
        }).forEach(node => {
          const nodeModel = node.getModel();
          // 右侧
          if (nodeModel.x - nodeBeforeCondition.getModel().x > 0) {
            node.updatePosition({ x: nodeModel.x - (BaseConfig.graph.horizontalGutter / 2 + conditionButtonWidth / 2), y: nodeModel.y });
          } else { // 左侧
            node.updatePosition({ x: nodeModel.x + (BaseConfig.graph.horizontalGutter / 2 + conditionButtonWidth / 2), y: nodeModel.y });
          }
        });

        // 上下移动 nodeAfterPlusDown --- y始终还没变 找出移动之后最靠近 nodeAfterPlusDown 的一个节点  判断是否需要向上移动
        // const loopCondition = findFirstCondition(nodeBeforeCondition);
        // const loopPlusDown = allNodes.filter(node => node.getModel().plusDown && node.getModel().belong === loopCondition.getModel().id);
        // 优先移动 删除分支后面的节点

        let lowestNodeAfterMove;
        allNodes.filter(node => {
          const nodeModel = node.getModel();
          return [nodeAfterPlusDown, ...afterConnectNodes].every(n => n.getModel().id !== nodeModel.id);
        }).forEach(node => {
          if (lowestNodeAfterMove) {
            if (lowestNodeAfterMove.getModel().y < node.getModel().y) {
              lowestNodeAfterMove = node;
            }
          } else {
            lowestNodeAfterMove = node;
          }
        });
        if (lowestNodeAfterMove) {
          const space = nodeAfterPlusDown.getModel().y - lowestNodeAfterMove.getModel().y;
          if (space > BaseConfig.graph.plusGutter) {
            [nodeAfterPlusDown, ...afterConnectNodes].forEach(node => {
              const nodeModel = node.getModel();
              node.updatePosition({ x: nodeModel.x, y: nodeModel.y - space + model.getHeight() / 2 + BaseConfig.graph.plusGutter / 2 });
            });
          }
        }
      }
    }
    this.graph.refresh();
  }
}

export default Process;
