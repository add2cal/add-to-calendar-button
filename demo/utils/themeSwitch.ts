import { get, set } from '@/utils/localStorage';

export type UserTheme = 'light' | 'dark';

export const setUserTheme = (): UserTheme => {
  // try to get the theme from local storage
  let theme = get('user-theme') as UserTheme;
  // if not set, we save it as "light"
  if (!theme) {
    theme = 'light';
    set('user-theme', theme);
  }
  // return dark or light + adjust the class on the html element
  if (theme === 'dark') {
    document.documentElement.classList.add('atcb-dark');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('atcb-dark');
    document.documentElement.classList.remove('dark');
  }
  return theme;
};

export const getUserTheme = (): UserTheme => {
  // try to get the theme from local storage
  const theme = get('user-theme') as UserTheme;
  // return this or "light"
  return theme || 'light';
};

export const changeUserTheme = (theme: UserTheme) => {
  // save the theme to local storage
  set('user-theme', theme);
  // return dark or light + adjust the class on the html element
  if (theme === 'dark') {
    document.documentElement.classList.add('atcb-dark');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('atcb-dark');
    document.documentElement.classList.remove('dark');
  }
};
