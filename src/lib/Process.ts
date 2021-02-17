import { Graph, GraphOptions } from '@antv/g6';
import { Emitter } from 'event-emitter';
import registry from '@/lib/Registry';
import FakeData from './fake-nodes';
import { createNode } from './create';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// editor config
interface ProcessConfig {
  base: GraphOptions;
  hooks: Hooks;
  emitter: Emitter;
  data?: Array<object> | undefined;
  rect?: Rect | undefined;
}

// canvas hooks
interface Hooks {
  [key: string]: Function;
}

export default class Process {
  // event listener
  public emitter: Emitter;

  // graph instance
  protected graph: Graph;

  constructor(config: ProcessConfig) {
    this.emitter = config.emitter;
    registry();
    this.graph = new Graph(config.base);
    this.registryHooks((config.hooks as Hooks));
    this.render();
    (window as any).graph = this.graph;
  }

  // registry hooks -- listen user action
  registryHooks(hooks: Hooks) {
    Reflect.ownKeys(hooks).forEach((key) => {
      const myKey = (key as string);
      this.graph.on(myKey, (event: Function) => {
        this.emitter.emit('test', 'hello event-emitter');
        hooks[myKey](event);
      });
    });
  }

  // get graph instance
  getGraph(): Graph {
    return this.graph;
  }

  // render data
  render() {
    const nodes = FakeData.nodes.map((node: any) => createNode(node.shape, node));
    console.log(nodes);
    this.graph.data({ nodes, edges: FakeData.edges });
    this.graph.render();
  }
}
