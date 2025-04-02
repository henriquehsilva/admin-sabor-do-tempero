import React, { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { OrderModal } from './components/OrderModal';

export interface Pedido {
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
  status: 'pedido feito' | 'in preparation' | 'out for delivery' | 'delivered';
  criadoEm?: string;
}

const statusTranslations = {
  'pedido feito': 'Pedido Feito',
  'in preparation': 'Em preparo',
  'out for delivery': 'Saiu para entrega',
  'delivered': 'Entregue'
};

function AdminPedidos() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
  const ordersPerPage = 20;

  const fetchPedidos = async () => {
    const pedidosRef = collection(db, 'pedidos');
    const pedidosQuery = query(pedidosRef, orderBy('criadoEm', 'desc'));
    const snapshot = await getDocs(pedidosQuery);
    const lista: Pedido[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pedido));
    setOrders(lista);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPedidos();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setOrders([]);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.nome.toLowerCase().includes(searchName.toLowerCase()) &&
      order.telefone.includes(searchPhone)
    );
  }, [orders, searchName, searchPhone]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const updateOrderStatus = async (orderId: string, newStatus: Pedido['status']) => {
    const orderRef = doc(db, 'pedidos', orderId);
    await updateDoc(orderRef, { status: newStatus });
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Pedido['status']) => {
    switch (status) {
      case 'pedido feito': return 'bg-yellow-100';
      case 'in preparation': return 'bg-red-100';
      case 'out for delivery': return 'bg-orange-100';
      case 'delivered': return 'bg-green-100';
      default: return '';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5C77E]">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <img src="/logo.png" alt="Logo" className="w-50 mx-auto mb-1" />          
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#F89D16] text-white py-2 rounded hover:bg-[#d98510]"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5C77E] p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#321314]">Painel de Pedidos</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchPedidos}
              className="px-4 py-2 bg-[#F89D16] text-white rounded-lg hover:bg-[#d98510]"
            >
              Recarregar Pedidos
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-[#8C552F] mb-2">Buscar por Nome</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8C552F]" size={20} />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-[#8C552F] rounded-lg"
                placeholder="Nome do cliente..."
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[#8C552F] mb-2">Buscar por Telefone</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8C552F]" size={20} />
              <input
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-[#8C552F] rounded-lg"
                placeholder="Número de telefone..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F89D16] text-white">
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Telefone</th>
                <th className="px-4 py-2">Prato</th>
                <th className="px-4 py-2">Qtd</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id} className={`${getStatusColor(order.status)} border-b`}>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#321314] hover:text-[#F89D16] underline"
                    >
                      {order.nome}
                    </button>
                  </td>
                  <td className="px-4 py-2">{order.telefone}</td>
                  <td className="px-4 py-2">{order.prato}</td>
                  <td className="px-4 py-2">{order.quantidade}</td>
                  <td className="px-4 py-2">R$ {order.total.toFixed(2)}</td>
                  <td className="px-4 py-2">{statusTranslations[order.status]}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Pedido['status'])}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pedido feito">Pedido Feito</option>
                      <option value="in preparation">Em preparo</option>
                      <option value="out for delivery">Saiu para entrega</option>
                      <option value="delivered">Entregue</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-[#8C552F]">
            Mostrando {Math.min(currentPage * ordersPerPage, filteredOrders.length)} de {filteredOrders.length} pedidos
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#F89D16] text-white rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#F89D16] text-white rounded-lg disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>

        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPedidos;
