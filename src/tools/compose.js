function compose() {
  const fns = [].slice.call(arguments);
  return function (initParams) {
    let res = initParams;
    for (let i = fns.length - 1; i > -1; i--) {
      res = fns[i](res);
    }
    return res;
  };
}
function pipe() {
  const fns = [].slice.call(arguments);
  return function (initialAgr) {
    let res = initialAgr;
    for (let i = 0; i < fns.length; i++) {
      res = fns[i](res);
    }
    return res;
  };
}
const greet = function (name) { return `hi:${name}`; };
const exclaim = function (statement) { return `${statement.toUpperCase()}!`; };
const transform = function (str) { return str.replace(/[dD]/, 'DDDDD'); };
const welcome1 = compose(greet, exclaim, transform);
const welcome2 = pipe(greet, exclaim, transform);
console.log(welcome1('dot'));
console.log(welcome2('dolb'));

function ReduceCompose(middlewares = []) {
  if (!Array.isArray(middlewares)) {
    middlewares = Array.from(arguments);
  }
  if (middlewares.some((fn) => typeof fn !== 'function')) {
    throw new TypeError('Middleware must be function');
  }
  return (next = async () => {}) = middlewares.reduce((a, b) => (arg) => a(() => b(arg)))(next);
}

function koaCompose(middlewares = []) {
  if (!Array.isArray(middlewares)) {
    middlewares = Array.from(arguments);
  }
  if (middlewares.some((fn) => typeof fn !== 'function')) {
    throw new TypeError('Middleware must be function');
  }
  return function () {
    return dispatchEvent(0);
    function dispatchEvent(i) {
      const fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(fn(() => dispatchEvent(i + 1)));
    }
  };
}

function expressCompose(middlewares = []) {
  if (!Array.isArray(middlewares)) {
    middlewares = Array.from(arguments);
  }
  if (middlewares.some((fn) => typeof fn !== 'function')) {
    throw new TypeError('Middleware must be function');
  }
  return async () => {
    let index = 0;
    async function next() {
      if (index === middlewares.length) {
        return Promise.resolve();
      }
      if (index < middlewares.length) {
        return Promise.resolve(middlewares[index++](next));
      }
    }
    return await next();
  };
}
