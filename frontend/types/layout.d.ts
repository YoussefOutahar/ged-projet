import React, {
  ReactElement,
  Dispatch,
  SetStateAction,
  HTMLAttributeAnchorTarget,
  ReactNode,
} from "react";

import { NextPage } from "next";

/* Next & Layout Types */
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

/* Breadcrumb Types */
export interface AppBreadcrumbProps {
  className?: string;
}

export interface Breadcrumb {
  labels?: string[];
  to?: string;
}

export interface BreadcrumbItem {
  items?: BreadcrumbItem[];
  label: string;
  to?: string;
}

/* Context Types */
export type LayoutState = {
  configSidebarVisible: boolean;
  menuHoverActive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
};

export type LayoutConfig = {
  colorScheme: string;
  inputStyle: string;
  menuMode: string;
  ripple: boolean;
  scale: number;
  theme: string;
};

export interface LayoutContextProps {
  layoutConfig: LayoutConfig;
  layoutState: LayoutState;
  onMenuToggle: () => void;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  setLayoutState: Dispatch<SetStateAction<LayoutState>>;
  showProfileSidebar: () => void;
}

export interface MenuContextProps {
  activeMenu: string;
  setActiveMenu: Dispatch<SetStateAction<string>>;
}

/* AppConfig Types */
export interface AppConfigProps {
  simple?: boolean;
}

/* AppTopbar Types */
export type NodeRef = MutableRefObject<ReactNode>;
export interface AppTopbarRef {
  menubutton?: HTMLButtonElement | null;
  topbarmenu?: HTMLDivElement | null;
  topbarmenubutton?: HTMLButtonElement | null;
}

/* AppMenu Types */
type CommandProps = {
  item: MenuModelItem;
  originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
};

export interface MenuProps {
  model: MenuModel[];
}

export interface MenuModel {
  icon?: string;
  items?: MenuModel[];
  label: string;
  seperator?: boolean;
  target?: HTMLAttributeAnchorTarget;
  to?: string;
  url?: string;
}

export interface AppMenuItem extends MenuModel {
  badge?: "UPDATED" | "NEW";
  badgeClass?: string;
  class?: string;
  command?: ({ item, originalEvent }: CommandProps) => void;
  disabled?: boolean;
  items?: AppMenuItem[];
  preventExact?: boolean;
  replaceUrl?: boolean;
  visible?: boolean;
}

export interface AppMenuItemProps {
  className?: string;
  index?: number;
  item?: AppMenuItem;
  parentKey?: string;
  root?: boolean;
}
