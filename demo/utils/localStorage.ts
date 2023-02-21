export enum LSKey {
  ATTRS = 'ATTRS',
  STATS = 'STATS',
  LANG = 'user-language',
}

let ls: Storage;
if (typeof window !== 'undefined') {
  if ('localStorage' in window && window.localStorage) {
    ls = window.localStorage;
  }
}

export const get = (key: string): any => {
  if (!ls) {
    return;
  }

  return ls.getItem(key);
};

export const set = (key: string, value: any) => {
  if (!ls) {
    return;
  }

  if (value && typeof value === 'object') {
    value = JSON.stringify(value);
  }

  ls.setItem(key, value);
};

export const remove = (key: string) => ls && ls.removeItem(key);

export const clear = () => ls && ls.clear();
