/* eslint-disable @typescript-eslint/no-explicit-any */
export const mergeDeep = (objA: any, objB: any) => {
  if (objB) {
    Object.keys(objB).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(objA, key) || typeof objB[key] !== 'object' || Array.isArray(objB[key])) {
        objA[key] = objB[key];
      } else {
        mergeDeep(objA[key], objB[key]);
      }
    });
  }

  return objA;
};
