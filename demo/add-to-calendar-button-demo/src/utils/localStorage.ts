let ls: Storage;

if (typeof window !== 'undefined') {
  if ('localStorage' in window && window.localStorage) {
    ls = window.localStorage;
  }
}

export const get = (key: string): string | null => {
  if (!ls) {
    return null;
  }

  return ls.getItem(key);
};

export const set = (key: string, value: string | object): Promise<void> => {
  return new Promise((resolve) => {
    if (!ls) {
      resolve();
      return;
    }

    if (value && typeof value === 'object') {
      value = JSON.stringify(value);
    }

    setTimeout(() => {
      try {
        ls.setItem(key, value as string);
      } catch {
        // localStorage may be unavailable (private mode, disabled, etc.) — ignore.
      }
      resolve();
    }, 0);
  });
};

export const remove = (key: string) => ls && ls.removeItem(key);

export const clear = () => ls && ls.clear();
