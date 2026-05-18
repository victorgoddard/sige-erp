export type PurchaseOrderStatus = 'PENDENTE' | 'APROVADA' | 'RECEBIDA';

export interface Supplier {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  date: string;
  supplier: Supplier;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: PurchaseOrderStatus;
}