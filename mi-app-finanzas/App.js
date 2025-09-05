import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Home, 
  PieChart, Settings, CreditCard, DollarSign, 
  Calendar, ChevronRight, X, Check, Briefcase,
  Car, Utensils, Film, Heart, Book, Shirt, MinusCircle,
  PlusCircle, Laptop, Smartphone, Building2
} from 'lucide-react';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : `http://${window.location.hostname}:3001/api`;

// Iconos disponibles
const ICONS = {
  wallet: Wallet,
  creditcard: CreditCard,
  smartphone: Smartphone,
  building2: Building2,
  briefcase: Briefcase,
  car: Car,
  utensils: Utensils,
  film: Film,
  heart: Heart,
  book: Book,
  shirt: Shirt,
  'minus-circle': MinusCircle,
  'plus-circle': PlusCircle,
  'trending-up': TrendingUp,
  laptop: Laptop,
  home: Home
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Estados para formularios
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking',
    balance: '',
    color: '#3b82f6',
    icon: 'wallet'
  });
  
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    account_id: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    fetchCategories();
    fetchStats();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts`);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAccount,
          balance: parseFloat(newAccount.balance) || 0
        })
      });
      
      if (response.ok) {
        fetchAccounts();
        fetchStats();
        setShowAddModal(false);
        setNewAccount({
          name: '',
          type: 'checking',
          balance: '',
          color: '#3b82f6',
          icon: 'wallet'
        });
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleAddTransaction = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount)
        })
      });
      
      if (response.ok) {
        fetchTransactions();
        fetchAccounts();
        fetchStats();
        setShowAddModal(false);
        setNewTransaction({
          type: 'expense',
          amount: '',
          description: '',
          account_id: '',
          category_id: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getIcon = (iconName) => {
    const IconComponent = ICONS[iconName] || Wallet;
    return IconComponent;
  };

  // Componente Home
  const HomeView = () => (
    <div className="pb-20">
      {/* Header con balance total */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 mb-6 shadow-lg">
        <p className="text-white/80 text-sm mb-1">Balance Total</p>
        <h2 className="text-white text-3xl font-bold mb-4">
          {formatCurrency(stats.totalBalance || 0)}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="text-white/80 text-xs">Ingresos (mes)</span>
            </div>
            <p className="text-white font-semibold">
              {formatCurrency(stats.monthlyIncome || 0)}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-300" />
              <span className="text-white/80 text-xs">Gastos (mes)</span>
            </div>
            <p className="text-white font-semibold">
              {formatCurrency(stats.monthlyExpense || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mb-6">
        <h3 className="text-gray-600 text-sm font-medium mb-3">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setModalType('transaction');
              setNewTransaction({ ...newTransaction, type: 'income' });
              setShowAddModal(true);
            }}
            className="bg-green-50 p-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="bg-green-500 p-2 rounded-xl">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Ingreso</span>
          </button>
          <button
            onClick={() => {
              setModalType('transaction');
              setNewTransaction({ ...newTransaction, type: 'expense' });
              setShowAddModal(true);
            }}
            className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="bg-red-500 p-2 rounded-xl">
              <MinusCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Gasto</span>
          </button>
        </div>
      </div>

      {/* Transacciones recientes */}
      <div>
        <h3 className="text-gray-600 text-sm font-medium mb-3">Transacciones Recientes</h3>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((transaction) => {
            const Icon = getIcon(transaction.category_icon);
            return (
              <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${transaction.category_color}20` }}
                    >
                      <Icon 
                        className="w-5 h-5" 
                        style={{ color: transaction.category_color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {transaction.description || transaction.category_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.account_name} • {new Date(transaction.date).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Componente de Cuentas
  const AccountsView = () => (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Mis Cuentas</h2>
        <button
          onClick={() => {
            setModalType('account');
            setShowAddModal(true);
          }}
          className="bg-blue-500 p-2 rounded-xl active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid gap-3">
        {accounts.map((account) => {
          const Icon = getIcon(account.icon);
          return (
            <div key={account.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: account.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{account.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatCurrency(account.balance)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Componente de Transacciones
  const TransactionsView = () => (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Transacciones</h2>
        <button
          onClick={() => {
            setModalType('transaction');
            setShowAddModal(true);
          }}
          className="bg-blue-500 p-2 rounded-xl active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="space-y-2">
        {transactions.map((transaction) => {
          const Icon = getIcon(transaction.category_icon);
          return (
            <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${transaction.category_color}20` }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: transaction.category_color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.description || transaction.category_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.account_name} • {new Date(transaction.date).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

// Modal para agregar cuenta o transacción
  const AddModal = () => {
    // Estados locales para el modal
    const [localAccount, setLocalAccount] = useState({
      name: '',
      type: 'checking',
      balance: '',
      color: '#3b82f6',
      icon: 'wallet'
    });
    
    const [localTransaction, setLocalTransaction] = useState({
      type: newTransaction.type || 'expense',
      amount: '',
      description: '',
      account_id: '',
      category_id: '',
      date: new Date().toISOString().split('T')[0]
    });

    const handleAddAccount = async () => {
      try {
        const response = await fetch(`${API_URL}/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...localAccount,
            balance: parseFloat(localAccount.balance) || 0
          })
        });
        
        if (response.ok) {
          fetchAccounts();
          fetchStats();
          setShowAddModal(false);
          setLocalAccount({
            name: '',
            type: 'checking',
            balance: '',
            color: '#3b82f6',
            icon: 'wallet'
          });
        }
      } catch (error) {
        console.error('Error adding account:', error);
      }
    };

    const handleAddTransaction = async () => {
      try {
        const response = await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...localTransaction,
            amount: parseFloat(localTransaction.amount)
          })
        });
        
        if (response.ok) {
          fetchTransactions();
          fetchAccounts();
          fetchStats();
          setShowAddModal(false);
          setLocalTransaction({
            type: 'expense',
            amount: '',
            description: '',
            account_id: '',
            category_id: '',
            date: new Date().toISOString().split('T')[0]
          });
        }
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {modalType === 'account' ? 'Nueva Cuenta' : 'Nueva Transacción'}
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {modalType === 'account' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
                <input
                  type="text"
                  value={localAccount.name}
                  onChange={(e) => setLocalAccount({ ...localAccount, name: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mi cuenta"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Tipo</label>
                <select
                  value={localAccount.type}
                  onChange={(e) => setLocalAccount({ ...localAccount, type: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="checking">Cuenta Corriente</option>
                  <option value="savings">Ahorro</option>
                  <option value="credit">Crédito</option>
                  <option value="cash">Efectivo</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Balance Inicial</label>
                <input
                  type="number"
                  value={localAccount.balance}
                  onChange={(e) => setLocalAccount({ ...localAccount, balance: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <button
                onClick={handleAddAccount}
                disabled={!localAccount.name}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium active:scale-95 transition-transform disabled:opacity-50"
              >
                Crear Cuenta
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setLocalTransaction({ ...localTransaction, type: 'income' })}
                  className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                    localTransaction.type === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Ingreso
                </button>
                <button
                  onClick={() => setLocalTransaction({ ...localTransaction, type: 'expense' })}
                  className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                    localTransaction.type === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Gasto
                </button>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Monto</label>
                <input
                  type="number"
                  value={localTransaction.amount}
                  onChange={(e) => setLocalTransaction({ ...localTransaction, amount: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Descripción</label>
                <input
                  type="text"
                  value={localTransaction.description}
                  onChange={(e) => setLocalTransaction({ ...localTransaction, description: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción opcional"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Cuenta</label>
                <select
                  value={localTransaction.account_id}
                  onChange={(e) => setLocalTransaction({ ...localTransaction, account_id: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Categoría</label>
                <select
                  value={localTransaction.category_id}
                  onChange={(e) => setLocalTransaction({ ...localTransaction, category_id: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories
                    .filter((cat) => cat.type === localTransaction.type)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Fecha</label>
                <input
                  type="date"
                  value={localTransaction.date}
                  onChange={(e) => setLocalTransaction({ ...localTransaction, date: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleAddTransaction}
                disabled={!localTransaction.amount || !localTransaction.account_id || !localTransaction.category_id}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium active:scale-95 transition-transform disabled:opacity-50"
              >
                Agregar Transacción
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status bar iOS style */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Mis Finanzas</h1>
      </div>

      {/* Contenido principal */}
      <div className="px-6 py-4">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'accounts' && <AccountsView />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'stats' && (
          <div className="pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-center">Próximamente...</p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Aquí verás gráficos y análisis detallados
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && <AddModal />}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'home' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Inicio</span>
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'accounts' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs mt-1">Cuentas</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'transactions' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <DollarSign className="w-6 h-6" />
            <span className="text-xs mt-1">Movimientos</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'stats' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <PieChart className="w-6 h-6" />
            <span className="text-xs mt-1">Estadísticas</span>
          </button>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;