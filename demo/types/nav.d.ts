interface NavChild {
  href: string;
  label: string;
  subline?: string;
  /* Optional icon name for the child item, which is compatible with an imported iconify set; e.g. "heroicons:document" */
  icon?: string;
}

interface NavParentItem {
  isParent: true;
  label: string;
  children: NavChild[];
}

interface NavLinkItem {
  href: string;
  label: string;
  isParent?: false;
}

export type NavItem = NavLinkItem | NavParentItem;
