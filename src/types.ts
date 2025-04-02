export interface Order {
  id: string;
  name: string;
  payment: string;
  dish: string;
  quantity: number;
  pickup: string;
  deliveryFee: number;
  phone: string;
  total: number;
  status: 'in preparation' | 'out for delivery' | 'delivered';
}

export const statusTranslations = {
  'in preparation': 'em preparo',
  'out for delivery': 'saiu para entrega',
  'delivered': 'entregue'
} as const;