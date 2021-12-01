interface Obj {
  [k: string]: any;
}

const delUndefined = (obj: Obj): Obj =>
  Object.entries(obj).reduce((resultObj, [propKey, propVal]) => {
    if (typeof propVal === 'undefined') return resultObj;

    return { ...resultObj, [propKey]: propVal };
  }, {});

export default delUndefined;
