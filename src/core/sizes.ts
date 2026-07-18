/**
 * Size attribute parsing, shared by the client decoration pipeline and the ssr
 * shell. Deliberately dependency-free: the ssr entry must stay importable in
 * plain Node, so this module must never grow imports that reach DOM-touching
 * code (lit, ui modules).
 *
 * The `size` attribute takes up to three pipe-separated values 0-10 (large,
 * medium, small viewport), mapping to a base font size of 10+n px; unset or
 * out-of-range parts fall back to 16px (or the next larger given value).
 */
function atcb_decorate_sizes(size?: string): { [key: string]: number | string } {
  const sizes: { [key: string]: number | string } = [] as unknown as { [key: string]: number | string };
  sizes['l'] = sizes['m'] = sizes['s'] = 16;
  if (size && size !== '') {
    const sizeParts: (string | number)[] = size.split('|');
    for (let i = 0; i < sizeParts.length; i++) {
      sizeParts[`${i}`] = parseInt(sizeParts[`${i}`] as string);
    }
    if ((sizeParts[0] as number) >= 0 && (sizeParts[0] as number) < 11) {
      sizes['l'] = sizes['m'] = sizes['s'] = 10 + (sizeParts[0] as number);
    }
    if (sizeParts.length > 2) {
      if ((sizeParts[1] as number) >= 0 && (sizeParts[1] as number) < 11) {
        sizes['m'] = 10 + (sizeParts[1] as number);
      }
      if ((sizeParts[2] as number) >= 0 && (sizeParts[2] as number) < 11) {
        sizes['s'] = 10 + (sizeParts[2] as number);
      }
    } else if (sizeParts.length == 2) {
      if ((sizeParts[1] as number) >= 0 && (sizeParts[1] as number) < 11) {
        sizes['m'] = sizes['s'] = 10 + (sizeParts[1] as number);
      }
    }
  }
  return sizes;
}

export { atcb_decorate_sizes };
