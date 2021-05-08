// 按最大 并发数 分组
const group = (list = [], max = 0) => {
  if (!list.length) {
    return list;
  }
  let result = [];
  for (let i = 0; i < list.length; i += max) {
    result.push(list.slice(i, i + max));
  }
  return result;
};
// group([1,2,3,4,5,6,7,8,9,1,1,1,1,222,1], 4)

const requestHandler = async (groupedUrl = [], callback = () => {}) => {
  if (!groupedUrl.length) {
    callback();
    return groupedUrl;
  }
  const newGroupedUrl = groupedUrl.map(fn => fn());
  const resultsMapper = results => results.map(callback);
  const data = await Promise.allSettled(newGroupedUrl).then(resultsMapper); // 是同时完成了才进行下一组的请求
  return data;
};

const sendRequest = async (urls = [], max = 0, callback = () => {}) => {
  if (!urls.length) {
    return urls;
  }
  const groupedUrls = group(urls, max);
  const results = [];
  for (let groupedUrl of groupedUrls) {
    try {
      const result = await requestHandler(groupedUrl, callback);
      results.push(result);
    } catch {}
  }
  return results;
};

// 并发数控制且进行错误数重发
var p1 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p1'));
var p2 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p2'));
var p3 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p3'));
var p4 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p4'));
var p5 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p5'));
var p6 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p6'));
var p7 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p7'));
var p8 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p8'));
var p9 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p9'));
var p10 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p10'));
var p11 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p11'));
var p12 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p12'));
var p13 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p13'));
var p14 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p14'));
var tasks = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14];
class TaskQueue {
  /**
   * 任务队列
   * @param tasks 请求数组
   * @param maxNum 最大并发数
   * @param callTime 错误重发次数
   * @param callback 回调
   */
  constructor(tasks, maxNum, callTime, callback) {
    this.maxNum = maxNum;
    this.running = 0;
    this.queue = tasks;
    this.results = [];
    this.callback = callback;
    this.next();
    this.callTime = callTime;
  }
  next() {
    while (this.running < this.maxNum && this.queue.length) {
      console.log('running');
      const task = this.queue.shift();
      let count = 0;
      const run = async task => {
        try {
          const res = await task(task);
          console.log('success push');
          this.results.push(res);
          this.running--;
          this.next();
        } catch (e) {
          console.log('trying');
          count += 1;
          if (count >= this.callTime) {
            console.log('fail push');
            this.results.push(e);
            this.running--;
            this.next();
          } else {
            run(task);
          }
        }
      };
      run.call(this, task);
      this.running++;
    }

    if (typeof this.callback === 'function' && this.running == 0) {
      this.callback.call(null, this.results);
    }
  }
}

new TaskQueue(tasks, 4, 2, r => {
  console.log('result', r);
});

// 4VM15:36 running
// VM15:42 success push
// VM15:36 running
// VM15:42 success push
// VM15:36 running
// VM15:42 success push
// VM15:36 running
// VM15:47 trying
// VM15:42 success push
// VM15:36 running
// VM15:42 success push
// VM15:36 running
// VM15:47 trying
// VM15:42 success push
// VM15:36 running
// VM15:42 success push
// VM15:36 running
// VM15:47 trying
// VM15:50 fail push
// VM15:36 running
// VM15:42 success push
// VM15:36 running
// 2VM15:47 trying
// VM15:50 fail push
// VM15:36 running
// 2VM15:42 success push
// 2VM15:47 trying
// VM15:50 fail push
// VM15:47 trying
// VM15:50 fail push
// VM15:70 result (14) ["p2", "p4", "p6", "p3", "p8", "p7", "p10", "p1", "p12", "p5", "p14", "p11", "p9", "p13"]
