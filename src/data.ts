import { Order } from './types';

const dishes = [
  'Feijoada', 'Moqueca', 'Acarajé', 'Pão de Queijo', 
  'Picanha', 'Coxinha', 'Brigadeiro', 'Pastel'
];

const generateRandomOrder = (id: number): Order => {
  const quantity = Math.floor(Math.random() * 5) + 1;
  const deliveryFee = Math.random() < 0.5 ? 10 : 15;
  const basePrice = Math.floor(Math.random() * 50) + 20;
  const total = (basePrice * quantity) + deliveryFee;
  const statuses = ['in preparation', 'out for delivery', 'delivered'] as const;

  return {
    id: id.toString().padStart(4, '0'),
    name: `Cliente ${id}`,
    payment: Math.random() > 0.5 ? 'Cartão' : 'Dinheiro',
    dish: dishes[Math.floor(Math.random() * dishes.length)],
    quantity,
    pickup: new Date(Date.now() - Math.random() * 10000000000).toLocaleString('pt-BR'),
    deliveryFee,
    phone: `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    total,
    status: statuses[Math.floor(Math.random() * statuses.length)]
  };
};

export const sampleOrders: Order[] = Array.from({ length: 50 }, (_, i) => generateRandomOrder(i + 1));