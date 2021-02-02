import { GraphOptions, Graph } from '@antv/g6';
import { Emitter } from 'event-emitter';

// editor config
interface ProcessConfig {
  base: GraphOptions;
  hooks: Hooks;
  emitter: Emitter;
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
    this.graph = new Graph(config.base);
    this.registryHooks((config.hooks as Hooks));
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
}
