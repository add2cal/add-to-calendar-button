let ls: Storage | undefined;

if (typeof window !== 'undefined') {
  try {
    ls = window.localStorage;
  } catch {
    // Storage can be blocked even when the property exists.
  }
}

export const get = (key: string): string | null => {
  if (!ls) {
    return null;
  }

  try {
    return ls.getItem(key);
  } catch {
    return null;
  }
};

export const set = async (key: string, value: string | object): Promise<void> => {
  if (!ls) return;
  try {
    ls.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  } catch {
    // Persistence is optional; in-memory UI state still works.
  }
};

export const remove = (key: string) => {
  try {
    ls?.removeItem(key);
  } catch {
    // Ignore unavailable storage.
  }
};

export const clear = () => {
  try {
    ls?.clear();
  } catch {
    // Ignore unavailable storage.
  }
};
