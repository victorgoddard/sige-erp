import type { PurchaseOrder } from '$lib/types/purchase-order';

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'OC0005',
    date: '20/05/2025',
    supplier: {
      id: '1',
      name: 'Vogel Tecnologia'
    },
    product: {
      id: '1',
      name: 'Parafuso 4x40'
    },
    quantity: 200,
    unitPrice: 0.25,
    totalPrice: 50,
    status: 'PENDENTE'
  },
  {
    id: '2',
    orderNumber: 'OC0004',
    date: '19/05/2025',
    supplier: {
      id: '2',
      name: 'Constrular Materiais'
    },
    product: {
      id: '2',
      name: 'Bucha 6mm'
    },
    quantity: 100,
    unitPrice: 0.15,
    totalPrice: 15,
    status: 'APROVADA'
  }
];