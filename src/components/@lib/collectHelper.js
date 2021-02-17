/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */
/* eslint-disable no-template-curly-in-string */
import uuid from '@/util/uuid';
import { merge, cloneDeep } from 'lodash';
import BaseConfig from '../BaseConfig';
// 开始
const start = {
  resourceId: uuid(), // 编码，唯一性
  properties: {
    overrideid: '',
    name: '开始', // 名称
    documentation: '',
    executionlisteners: {
      executionListeners: [
        {
          event: 'end',
          implementation: '${createProcessInstanceConfigListener}',
          className: '',
          expression: '',
          delegateExpression: '${createProcessInstanceConfigListener}',
        },
      ],
    },
    initiator: 'initiator',
    formkeydefinition: '',
    formproperties: '',
  },
  stencil: {
    id: 'StartNoneEvent',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '',
    },
  ],
  bounds: {
    lowerRight: {
      x: 152.5,
      y: 270,
    },
    upperLeft: {
      x: 122.5,
      y: 240,
    },
  },
  dockers: [],
};

// 结束
const end = {
  resourceId: '', // 编码，唯一性，默认生成
  properties: {
    overrideid: '',
    name: '结束', // 名称
    documentation: '',
    executionlisteners: {
      executionListeners: [
        {
          event: 'end',
          implementation: '${processCompleteMessageListener}',
          className: '',
          expression: '',
          delegateExpression: '${processCompleteMessageListener}',
        },
      ],
    },
  },
  stencil: {
    id: 'EndNoneEvent',
  },
  childShapes: [],
  outgoing: [],
  bounds: {
    lowerRight: {
      x: 73,
      y: 549,
    },
    upperLeft: {
      x: 45,
      y: 521,
    },
  },
  dockers: [],
};

// 第一个用户任务节点 对用 画布的第一个节点 而不是上面的
const firstNode = {
  resourceId: '', // 编码，唯一性，默认生成
  properties: {
    overrideid: '',
    name: '请假单', // 名称
    documentation: '',
    asynchronousdefinition: 'false',
    exclusivedefinition: 'false',
    executionlisteners: '',
    multiinstance_type: 'None',
    multiinstance_cardinality: '',
    multiinstance_collection: '',
    multiinstance_variable: '',
    multiinstance_condition: '',
    isforcompensation: 'false',
    usertaskassignment: {
      assignment: {
        assignee: '${initiator}',
      },
    },
    formkeydefinition: '',
    duedatedefinition: '',
    prioritydefinition: '',
    formproperties: '',
    tasklisteners: {
      taskListeners: [
        {
          event: 'create',
          implementation: '${taskCreateMessageListener}',
          className: '',
          expression: '',
          delegateExpression: '${taskCreateMessageListener}',
        },
      ],
    },
  },
  stencil: {
    id: 'UserTask',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '', // 下一个节点编码
    },
  ],
  bounds: {
    lowerRight: {
      x: 295,
      y: 290,
    },
    upperLeft: {
      x: 195,
      y: 210,
    },
  },
  dockers: [],
};

// 任务
const approver = {
  resourceId: '', // 编码，唯一性，默认生成
  properties: {
    overrideid: '',
    name: '', // 名称
    documentation: '',
    asynchronousdefinition: 'false',
    exclusivedefinition: 'false',
    executionlisteners: '',
    multiinstance_type: 'None',
    multiinstance_cardinality: '',
    multiinstance_collection: '',
    multiinstance_variable: '',
    multiinstance_condition: '',
    isforcompensation: 'false',
    usertaskassignment: {
      assignment: {
        candidateGroups: [
          // {
          //   value: '${字段}', // 候选角色，来源于配置中的candidateGroups项
          //   $$hashKey: '160',
          // },
          // {
          //   value: '研发1', // 候选角色，来源于配置中的candidateGroups项
          //   $$hashKey: '164',
          // },
        ],
      },
    },
    formkeydefinition: '',
    duedatedefinition: '',
    prioritydefinition: '',
    formproperties: '',
    tasklisteners: {
      taskListeners: [
        {
          event: 'create',
          implementation: '${taskCreateMessageListener}',
          className: '',
          expression: '',
          delegateExpression: '${taskCreateMessageListener}',
        },
      ],
    },
  },
  stencil: {
    id: 'UserTask',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '', // 下一个节点编码
    },
  ],
  bounds: {
    lowerRight: {
      x: 295,
      y: 290,
    },
    upperLeft: {
      x: 195,
      y: 210,
    },
  },
  dockers: [],
};

// 会签
const countersign = {
  resourceId: '', // 编码，唯一性，默认生成
  properties: {
    overrideid: '',
    name: '', // 名称
    documentation: '',
    asynchronousdefinition: 'false',
    exclusivedefinition: false,
    executionlisteners: {
      executionListeners: [
        {
          event: 'start',
          implementation: '${clearSignVariables}',
          className: '',
          expression: '',
          delegateExpression: '${clearSignVariables}',
        },
      ],
    },
    multiinstance_type: 'Parallel',
    multiinstance_cardinality: '',
    multiinstance_collection: '${assignees}', // 会签人列表：指定表单变量或列表变量${assignees}
    multiinstance_variable: 'assignee',
    multiinstance_condition: '${nrOfCompletedInstances == nrOfInstances}',
    isforcompensation: 'false',
    usertaskassignment: {
      assignment: {
        assignee: '${assignee}',
      },
    },
    formkeydefinition: '',
    duedatedefinition: '',
    prioritydefinition: '',
    formproperties: '',
    tasklisteners: {
      taskListeners: [
        {
          event: 'create',
          implementation: '${taskCreateMessageListener}',
          className: '',
          expression: '',
          delegateExpression: '${taskCreateMessageListener}',
        },
      ],
    },
  },
  stencil: {
    id: 'UserTask',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '', // 下一个节点编码
    },
  ],
  bounds: {
    lowerRight: {
      x: 442.5,
      y: 295,
    },
    upperLeft: {
      x: 342.5,
      y: 215,
    },
  },
  dockers: [],
};

// 网关
const gateway = {
  resourceId: '', // 编码，唯一性，默认生成
  properties: {
    overrideid: '',
    name: '排他网关', // 名称
    documentation: '',
    asynchronousdefinition: 'false',
    exclusivedefinition: 'false',
    sequencefloworder: '',
    executionlisteners: '',
  },
  stencil: {
    id: 'ExclusiveGateway',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '', // 下一个节点编码
    },
    {
      resourceId: '', // 下一个节点编码
    },
  ],
  bounds: {
    lowerRight: {
      x: 970,
      y: 535,
    },
    upperLeft: {
      x: 930,
      y: 495,
    },
  },
  dockers: [],
};

// 同步子流程
const syncSubProcess = {
  resourceId: '', // 自定义id
  properties: {
    overrideid: '',
    name: '', // 名称
    documentation: '',
    asynchronousdefinition: false,
    exclusivedefinition: 'false',
    executionlisteners: '',
    callactivitycalledelement: '', // 子流程标识，由配置字段sub_process注入
    callactivityinparameters: {
      inParameters: [
        {
          source: 'currentHandler',
          sourceExpression: '',
          target: 'initiator',
        },
        {
          source: 'orgId',
          sourceExpression: '',
          target: 'orgId',
        },
        {
          source: 'parentProcessInstanceId',
          sourceExpression: '',
          target: 'parentProcessInstanceId',
        },
      ],
    },
    callactivityoutparameters: '',
    multiinstance_type: 'None',
    multiinstance_cardinality: '',
    multiinstance_collection: '',
    multiinstance_variable: '',
    multiinstance_condition: '',
    isforcompensation: 'false',
  },
  stencil: {
    id: 'CallActivity',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '', // 下一个组件id
    },
  ],
  bounds: {
    lowerRight: {
      x: 505.5,
      y: 307,
    },
    upperLeft: {
      x: 405.5,
      y: 227,
    },
  },
  dockers: [],
};

// 异步子流程
const asyncSubProcess = {
  resourceId: '', // 自定义id
  properties: {
    overrideid: '',
    name: '', // 名称
    documentation: '',
    asynchronousdefinition: 'false',
    exclusivedefinition: 'false',
    executionlisteners: '',
    multiinstance_type: 'None',
    multiinstance_cardinality: '',
    multiinstance_collection: '',
    multiinstance_variable: '',
    multiinstance_condition: '',
    isforcompensation: 'false',
    usertaskassignment: '',
    formkeydefinition: '',
    duedatedefinition: '',
    prioritydefinition: '',
    formproperties: '',
    tasklisteners: {
      taskListeners: [
        {
          event: 'create',
          implementation: 'com.xbrother.bpm.listener.CallProcessListener',
          className: 'com.xbrother.bpm.listener.CallProcessListener',
          expression: '',
          delegateExpression: '',
        },
      ],
    },
  },
  stencil: {
    id: 'UserTask',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '', // 下一个节点id
    },
  ],
  bounds: {
    lowerRight: {
      x: 505.5,
      y: 307,
    },
    upperLeft: {
      x: 405.5,
      y: 227,
    },
  },
  dockers: [],
};

// 连线
const link = {
  resourceId: '', // 编码，唯一性，默认生成
  properties: {
    overrideid: '',
    name: '连线', // 线上标题
    documentation: '',
    conditionsequenceflow: '', // 条件表达式，由配置字段conditions注入
    executionlisteners: '',
    defaultflow: 'false',
  },
  stencil: {
    id: 'SequenceFlow',
  },
  childShapes: [],
  outgoing: [
    {
      resourceId: '', // 下一个节点编码
    },
  ],
  bounds: {
    lowerRight: {
      x: 929.7578163366582,
      y: 515.4425424275254,
    },
    upperLeft: {
      x: 820.3554649133418,
      y: 515.1394888224746,
    },
  },
  dockers: [
    {
      x: 20.5,
      y: 20.5,
    },
    {
      x: 50,
      y: 40,
    },
  ],
  target: {
    resourceId: '', // 目标节点编码，和outgoing一致（这里暂时没搞明白是什么作用）
  },
};

// 外层jsonXml
const jsonXml = {
  resourceId: '127501',
  properties: {
    process_id: 'pk780450959163011072',
    name: '请假单流程',
    documentation: '',
    process_author: '',
    process_version: '',
    process_namespace: 'http://www.activiti.org/processdef',
    executionlisteners: '',
    eventlisteners: '',
    signaldefinitions: '',
    messagedefinitions: '',
  },
  stencil: {
    id: 'BPMNDiagram',
  },
  childShapes: [],
  bounds: {
    lowerRight: {
      x: 1200,
      y: 950,
    },
    upperLeft: {
      x: 0,
      y: 0,
    },
  },
  stencilset: {
    url: 'stencilsets/bpmn2.0/bpmn2.0.json',
    namespace: 'http://b3mn.org/stencilset/bpmn2.0#',
  },
  ssextensions: [],
};

/**
 * 获取下一 plus 节点，将他作为 link 连线
 * @param {*} id
 * @param {*} graph
 */
const getLinkNodeId = (id, graph) => {
  const node = graph.findById(id);
  const targetModel = node.getOutEdges()[0]._cfg.targetNode.getModel();
  if (Reflect.has(targetModel, 'plusDown')) {
    return getLinkNodeId(targetModel.id, graph);
  }
  return targetModel.id;
};

/**
 * 获取下一个编辑节点或者是 gatway(condition) 节点的id
 * @param {*} id
 * @param {*} graph
 */
const getNextEditableNode = (id, graph) => {
  const node = graph.findById(id);
  const nextNodelModel = node.getOutEdges()[0]._cfg.targetNode.getModel();
  if (nextNodelModel.editable || nextNodelModel.key === BaseConfig.property.condition.key || nextNodelModel.key === BaseConfig.property.end.key) {
    return nextNodelModel.id;
  }
  return getNextEditableNode(nextNodelModel.id, graph);
};


/**
 * 组合所有数据 BIG JSON 包含三部分 （jsonXml, nodesConfig, origin）
 * @param {*} allNodes graph 中的所有节点
 * @param {*} graph 实例
 */
export const combinateNodes = (allNodes, graph) => {
  const { nodes } = allNodes;
  const nodesConfig = {};
  const childShapes = [];
  let linkId;
  const filterNodes = nodes.filter(node => {
    if (Reflect.has(node, 'plusDown')) {
      return false;
    }
    // 这里过滤掉 branch 节点 以及 处于 branch 节点之下紧挨的 plus 节点 （在组合网关节点是已经添加进去了）
    if (node.key === BaseConfig.property.plus.key) {
      const target = graph.findById(node.id);
      const edges = target.getInEdges();
      if (edges && edges.length) { // 开始节点是没有 InEdges 的
        const prevNode = edges[0]._cfg.sourceNode;
        let k = prevNode.getModel().key;
        return k !== BaseConfig.property.branch.key;
      }
    }
    return node.key !== BaseConfig.property.branch.key;
  });
  filterNodes.forEach(node => {
    const {
      key,
      id,
      attributes,
      name,
      specify,
      member,
      form,
      signType,
      variables,
      processId,
      buttons,
      transmitters,
    } = node;
    switch (key) {
      // 第一个用户任务节点
      case BaseConfig.property.start.key:
        const firstUserNode = {
          resourceId: id,
          name,
          form_properties: [...form],
          action_buttons: buttons,
          transmitters,
        };

        // 处理 jsonXml
        // 初始节点与第一个任务节点之间要构造一条连线
        linkId = uuid();
        start.outgoing = [{ resourceId: linkId }];
        childShapes.push(cloneDeep(start));

        link.resourceId = linkId;
        link.target = { resourceId: id };
        link.outgoing = [cloneDeep(link.target)];
        childShapes.push(cloneDeep(link));

        // 第一个业务节点
        firstNode.resourceId = id;
        firstNode.properties.name = name;
        firstNode.properties.formproperties = [...form];
        firstNode.outgoing = [{ resourceId: getLinkNodeId(id, graph) }];
        childShapes.push(cloneDeep(firstNode));

        // 加入 nodesConfig
        nodesConfig[start.resourceId] = {
          resourceId: start.resourceId,
          name: start.properties.name,
          action_buttons: [
            { id: 'CREATE', name: '创建', url: '/api/v1/bpm/process/start' },
            { id: 'SAVE', name: '保存', url: '/api/v1/bpm/tasks/saveFormData' },
          ],
        };
        nodesConfig[link.resourceId] = { resourceId: link.resourceId, name: link.properties.name };
        nodesConfig[id] = { ...attributes, ...firstUserNode };

        break;

      // 用户任务节点
      case BaseConfig.property.approver.key:
        const userNode = {
          resourceId: id,
          name,
          transmitters, // 抄送
          candidateType: specify, // 0 - 成员， 1 - 部门， 2 - 角色， 3 - 字段
          candidateGroups: specify === '3' ? [] : [...member.map(mem => (mem.uid + ''))],
          form_properties: [...form],
          variables: (specify === '3' && variables) ? [variables] : [],
          action_buttons: buttons || [],
        };
        // 处理 jsonXml
        linkId = getLinkNodeId(id, graph);
        approver.resourceId = id;
        approver.properties.name = name;
        // approver.formproperties = [...form];
        if (specify === '3') { // 选择字段
          approver.properties.usertaskassignment.assignment.candidateGroups = [{ value: '${' + variables + '}', $$hashKey: uuid() }];
        } else {
          approver.properties.usertaskassignment.assignment.candidateGroups = member.map(mem => ({ value: mem.uid + '', $$hashKey: uuid() }));
        }
        approver.outgoing = [{ resourceId: linkId }];
        childShapes.push(cloneDeep(approver));

        // 加入 nodesConfig
        nodesConfig[id] = { ...attributes, ...userNode };

        break;

      // 会签节点
      case BaseConfig.property.countersign.key:
        const countersignNode = {
          resourceId: id,
          name,
          candidateType: specify, // 0 - 成员， 1 - 部门， 2 - 角色， 3 - 字段
          candidateGroups: specify === '3' ? [] : [...member.map(mem => (mem.uid + ''))],
          form_properties: [...form],
          sign_rules: signType,
          variables: specify === '3' ? [variables] : [],
          assignees: specify === '3' ? [] : [...member.map(mem => (mem.uid + ''))],
          action_buttons: buttons || [],
        };

        // 处理 jsonXml
        linkId = getLinkNodeId(id, graph);
        countersign.resourceId = id;
        countersign.properties.name = name;
        // countersign.formproperties = [...form];
        if (specify === '3') { // TODO:  跟进 specify 类型决定
          countersign.properties.multiinstance_collection = '${' + variables + '}';
        }
        countersign.outgoing = [{ resourceId: linkId }];
        childShapes.push(cloneDeep(countersign));

        // 加入 nodesConfig
        nodesConfig[id] = { ...attributes, ...countersignNode };

        break;

      // 异步子流程节点
      case BaseConfig.property.async.key:
        const asNode = {
          resourceId: id,
          name,
          sub_process: {
            sub_process_key: processId,
          },
        };
        // 处理 jsonXml
        linkId = getLinkNodeId(id, graph);
        asyncSubProcess.resourceId = id;
        asyncSubProcess.properties.name = name;
        asyncSubProcess.outgoing = [{ resourceId: linkId }];
        childShapes.push(cloneDeep(asyncSubProcess));

        // 加入 nodesConfig
        nodesConfig[id] = merge(attributes, asNode);
        break;

      // 同步子流程节点
      case BaseConfig.property.sync.key:
        const sNode = {
          resourceId: id,
          name,
          sub_process: {
            sub_process_key: processId,
          },
        };
        // 处理 jsonXml
        linkId = getLinkNodeId(id, graph);
        syncSubProcess.resourceId = id;
        syncSubProcess.properties.name = name;
        syncSubProcess.properties.callactivitycalledelement = 'pk' + processId;
        syncSubProcess.outgoing = [{ resourceId: linkId }];
        childShapes.push(cloneDeep(syncSubProcess));

        // 加入 nodesConfig
        nodesConfig[id] = merge(attributes, sNode);
        break;

      // 流程结束
      case BaseConfig.property.end.key:
        const endNode = {
          resourceId: id,
          name: '结束',
        };
        // 处理 jsonXml
        end.resourceId = id;
        childShapes.push(cloneDeep(end));
        // 加入 nodesConfig
        nodesConfig[id] = cloneDeep({ ...endNode });
        break;

      // 网关 == condition
      case BaseConfig.property.condition.key:
        const conditionNode = {
          resourceId: id,
          name: '排他网关',
        };
        // FIXME:
        // 将 接下来的 branch 作为 activity 流程的中的条件分支来定义成连线的对象 (等于链接下一个节点的线)
        const branchNodes = graph.findById(id).getOutEdges().map(edge => edge._cfg.targetNode);
        const ids = branchNodes.map(nd => ({ resourceId: nd.getModel().id }));
        // 如果修改了 会签的选项，这里希望是自动同步的
        // eslint-disable-next-line no-unused-vars
        let activeRule;
        const beforeNodes = graph.findById(id).getInEdges()[0]._cfg.sourceNode.getInEdges()[0]._cfg.sourceNode;
        if (beforeNodes) {
          const mod = beforeNodes.getModel();
          if (mod.key === BaseConfig.property.countersign.key) {
            activeRule = mod.signTypeMap[mod.signType].split(' && ');
          }
        }
        // 处理 jsonXml
        gateway.resourceId = id;
        gateway.outgoing = ids;
        childShapes.push(cloneDeep(gateway));
        // 加入 nodesConfig
        nodesConfig[id] = cloneDeep(conditionNode);

        // 组合成条件分支并且添加
        branchNodes.sort((a, b) => b.getModel().x - a.getModel().x).forEach((nd, index) => {
          const md = nd.getModel();
          const obj = {
            type: 'condition',
            resourceId: md.id,
            name: md.name,
            // eslint-disable-next-line quotes
            conditions: md.conditionList.length ? "${" + md.conditionList.map(con => {
              if (con.dataType === 'String') {
                // eslint-disable-next-line quotes
                return (con.field + con.relation + "'" + (Array.isArray(con.val) ? con.val.join(',') : con.val) + "'");
              }
              return (con.field + con.relation + con.val);
            // eslint-disable-next-line quotes
            }).join(' && ') + "}" : '',
            variables: md.conditionList.map(con => (con.field)),
          };
          // node_config也需要带上会签选择的内容
          if (Reflect.has(md, 'rule')) {
            obj.conditions = activeRule ? activeRule[index] : md.rule;
          }
          // 处理 jsonXml
          // 这里跳过了与之相邻的 plus 节点和下面的 plusDown 节点
          const tLinkId = getNextEditableNode(md.id, graph);
          link.resourceId = md.id;
          link.properties.name = md.name;
          // 如果修改了 会签的选项，这里希望是自动同步的
          link.properties.conditionsequenceflow = Reflect.has(md, 'rule') ? (activeRule ? activeRule[index] : md.rule) : (md.conditionList.length ? '${' + md.conditionList.map(con => {
            if (con.dataType === 'String') {
              // eslint-disable-next-line quotes
              return (con.field + con.relation + "'" + (Array.isArray(con.val) ? con.val.join(',') : con.val) + "'");
            }
            return (con.field + con.relation + con.val);
          // eslint-disable-next-line quotes
          }).join(' && ') + "}" : '');
          link.target = { resourceId: tLinkId };
          link.outgoing = [{ resourceId: tLinkId }];
          childShapes.push(cloneDeep(link));
          // 加入 nodesConfig
          nodesConfig[md.id] = cloneDeep(obj);
        });

        break;

      // 常规连线 也就是
      case BaseConfig.property.plus.key:
        const linkNode = {
          resourceId: id,
          name: '连线',
          type: 'sequence',
        };
        // 处理 jsonXml
        linkId = getLinkNodeId(id, graph);
        link.resourceId = id;
        link.target = { resourceId: linkId };
        link.properties.name = '连线';
        link.properties.conditionsequenceflow = '';
        link.outgoing = [link.target];
        childShapes.push(cloneDeep(link));
        // 加入 nodesConfig
        nodesConfig[id] = cloneDeep(linkNode);
        break;
      default:
        break;
    }
  });
  jsonXml.childShapes = childShapes;
  return cloneDeep({ nodesConfig, jsonXml, origin: allNodes });
};

export default {
  start,
  end,
  approver,
  countersign,
  gateway,
  asyncSubProcess,
  syncSubProcess,
  combinateNodes,
};
