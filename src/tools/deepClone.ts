export const getObjectType = (target: any) => {
  return target === null
    ? 'null'
    : target instanceof Array
    ? 'array'
    : typeof target !== 'object'
    ? typeof target
    : 'object';
};
export interface FakerObj {
    [key: string]: [val: Object | string] 
}
export const deepClone = (target: any) => {
    const type = getObjectType(target)
    if (type === 'object') {
        const res: FakerObj = {};
        Object.keys(target).forEach((key: string) => {
            res[key] = deepClone(target[key])
        })
        return res;
    }
    if (type === 'array') {
      const res = [];
      target.forEach(element => {
          res.push(deepClone(element))
      });
      return res;
    }
    return target;
};
