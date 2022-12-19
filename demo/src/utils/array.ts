export const mergeDeep = (objA: any, objB: any) => {
  if (objB) {
    Object.keys(objB).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(objA, key) || typeof objB[key] !== 'object') {
        objA[key] = objB[key];
      } else {
        mergeDeep(objA[key], objB[key]);
      }
    });
  }

  return objA;
};
