import React from 'react';
import { X, User, Phone, Utensils, CreditCard, Home, Truck, Calendar, ClipboardList } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold text-[#321314] flex items-center gap-2">
            <ClipboardList size={24} /> Pedido #{order.id.substring(0, 6).toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-[#8C552F] hover:text-[#321314] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <User className="text-[#8C552F]" size={18} />
            <span className="font-semibold text-[#8C552F]">Cliente:</span>
            <span>{order.nome}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="text-[#8C552F]" size={18} />
            <span className="font-semibold text-[#8C552F]">Telefone:</span>
            <span>{order.telefone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Utensils className="text-[#8C552F]" size={18} />
            <span className="font-semibold text-[#8C552F]">Prato:</span>
            <span>{order.prato} (x{order.quantidade})</span>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard className="text-[#8C552F]" size={18} />
            <span className="font-semibold text-[#8C552F]">Pagamento:</span>
            <span>{order.pagamento}</span>
          </div>

          {!order.retirada && order.endereco && (
            <div className="flex items-center gap-2">
              <Home className="text-[#8C552F]" size={18} />
              <span className="font-semibold text-[#8C552F]">Entrega:</span>
              <span>{order.endereco}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Truck className="text-[#8C552F]" size={18} />
            <span className="font-semibold text-[#8C552F]">Taxa:</span>
            <span>R$ {order.taxaEntrega.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#8C552F]">Total:</span>
            <span className="text-green-700 font-bold">R$ {order.total.toFixed(2)}</span>
          </div>

          {order.criadoEm && (
            <div className="flex items-center gap-2">
              <Calendar className="text-[#8C552F]" size={18} />
              <span className="font-semibold text-[#8C552F]">Data/Hora:</span>
              <span>{new Date(order.criadoEm).toLocaleString('pt-BR')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
