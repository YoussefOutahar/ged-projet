/* FullCalendar Types */
import { EventApi, EventInput } from "@fullcalendar/core";

/* Chart.js Types */
import { ChartData, ChartOptions } from "chart.js";

type InventoryStatus = "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";

type Status = "DELIVERED" | "PENDING" | "RETURNED" | "CANCELLED";

export type LayoutType = "list" | "grid";
export type SortOrderType = 1 | 0 | -1;

export interface CustomEvent {
  color?: string;
  date?: string;
  icon?: string;
  image?: string;
  name?: string;
  status?: "Ordered" | "Processing" | "Shipped" | "Delivered";
}

interface ShowOptions {
  content?: string;
  detail?: string;
  life?: number;
  severity?: string;
  summary?: string;
}

export interface ChartDataState {
  barData?: ChartData;
  lineData?: ChartData;
  pieData?: ChartData;
  polarData?: ChartData;
  radarData?: ChartData;
}
export interface ChartOptionsState {
  barOptions?: ChartOptions;
  lineOptions?: ChartOptions;
  pieOptions?: ChartOptions;
  polarOptions?: ChartOptions;
  radarOptions?: ChartOptions;
}

export interface AppMailProps {
  mails: Demo.Mail[];
}

export interface AppMailSidebarItem {
  badge?: number;
  badgeValue?: number;
  icon: string;
  label: string;
  to?: string;
}

export interface AppMailReplyProps {
  content: Demo.Mail | null;
  hide: () => void;
}

declare namespace Demo {
  interface Task {
    attachments?: string;
    comments?: string;
    completed?: boolean;
    description?: string;
    endDate?: string;
    id?: number;
    members?: Member[];
    name?: string;
    startDate?: string;
    status?: string;
  }

  interface Member {
    image: string;
    name: string;
  }

  interface DialogConfig {
    header: string;
    newTask: boolean;
    visible: boolean;
  }

  interface Mail {
    archived: boolean;
    date: string;
    email: string;
    from: string;
    id: number;
    image: string;
    important: boolean;
    message: string;
    sent: boolean;
    spam: boolean;
    starred: boolean;
    title: string;
    to: string;
    trash: boolean;
  }

  interface User {
    id: number;
    image: string;
    lastSeen: string;
    messages: Message[];
    name: string;
    status: string;
  }

  interface Message {
    createdAt: number;
    ownerId: number;
    text: string;
  }

  //ProductService
  type Product = {
    [key: string]:
      | string
      | string[]
      | number
      | boolean
      | undefined
      | ProductOrder[]
      | InventoryStatus;
    category?: string;
    code?: string;
    description: string;
    id?: string;
    image?: string;
    inventoryStatus?: InventoryStatus;
    name: string;
    orders?: ProductOrder[];
    price?: number;
    quantity?: number;
    rating?: number;
  };

  type ProductOrder = {
    amount?: number;
    customer?: string;
    date?: string;
    id?: string;
    productCode?: string;
    quantity?: number;
    status?: Status;
  };

  type Payment = {
    amount: number;
    date: string;
    name: string;
    paid: boolean;
  };

  //CustomerService
  type Customer = {
    activity?: number;
    amount?: number;
    balance?: number | string;
    company?: string;
    date: Date;
    id?: number;
    image?: string;
    inventoryStatus?: string;
    name?: string;
    orders?: Demo.Customer[];
    price?: number;
    rating?: number;
    representative: {
      image: string;
      name: string;
    };
    status?: string;
    verified?: boolean;
  };

  interface Event extends EventInput {
    description?: string;
    location?: string;
    tag?: {
      color: string;
      name: string;
    };
  }

  // PhotoService
  type Photo = {
    alt?: string | undefined;
    itemImageSrc?: string | undefined;
    thumbnailImageSrc?: string | undefined;
    title: string;
  };

  type Country = {
    code: string;
    name: string;
  };

  // IconService
  type Icon = {
    attrs?: [{}];
    icon?: {
      attrs?: [{}];
      grid?: number;
      isMulticolor?: boolean;
      isMulticolor2?: boolean;
      paths?: string[];
      tags?: string[];
    };
    iconIdx?: number;
    properties?: {
      code?: number;
      id: number;
      name: string;
      order?: number;
      prevSize?: number;
    };
    setId?: number;
    setIdx?: number;
  };
}
