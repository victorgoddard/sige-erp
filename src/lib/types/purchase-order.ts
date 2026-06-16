import type { StatusType } from "$lib/enums/orderStatus";

export type PurchaseOrderStatus = StatusType;

export interface Supplier {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  date: string;
  supplier: Supplier;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: StatusType;
}
