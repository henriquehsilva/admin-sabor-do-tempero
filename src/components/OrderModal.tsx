import React from 'react';
import { X } from 'lucide-react';

interface Pedido {
  id: string;
  nome: string;
  telefone: string;
  prato: string;
  quantidade: number;
  pagamento: string;
  retirada: boolean;
  endereco?: string;
  taxaEntrega: number;
  total: number;
  criadoEm?: string;
}

interface OrderModalProps {
  order: Pedido;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#321314]">Detalhes do Pedido</h2>
          <button onClick={onClose} className="text-[#8C552F] hover:text-[#321314]">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-semibold text-[#8C552F]">ID do Pedido</p>
            <p>{order.id}</p>
          </div>
          <div>
            <p className="font-semibold text-[#8C552F]">Cliente</p>
            <p>{order.nome}</p>
          </div>
          <div>
            <p className="font-semibold text-[#8C552F]">Telefone</p>
            <p>{order.telefone}</p>
          </div>
          <div>
            <p className="font-semibold text-[#8C552F]">Prato</p>
            <p>{order.prato} (x{order.quantidade})</p>
          </div>
          <div>
            <p className="font-semibold text-[#8C552F]">Forma de Pagamento</p>
            <p>{order.pagamento}</p>
          </div>
          {!order.retirada && (
            <div>
              <p className="font-semibold text-[#8C552F]">Endereço de Entrega</p>
              <p>{order.endereco}</p>
            </div>
          )}
          <div>
            <p className="font-semibold text-[#8C552F]">Taxa de Entrega</p>
            <p>R$ {order.taxaEntrega.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold text-[#8C552F]">Total</p>
            <p>R$ {order.total.toFixed(2)}</p>
          </div>
          {order.criadoEm && (
            <div>
              <p className="font-semibold text-[#8C552F]">Data/Hora do Pedido</p>
              <p>{new Date(order.criadoEm).toLocaleString('pt-BR')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
