import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Home, 
  PieChart, Settings, CreditCard, DollarSign, 
  Calendar, ChevronRight, X, Check, Briefcase,
  Car, Utensils, Film, Heart, Book, Shirt, MinusCircle,
  PlusCircle, Laptop, Smartphone, Building2, MoreVertical,
  Bell, User, ArrowUp, ArrowDown
} from 'lucide-react';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : `http://${window.location.hostname}:3001/api`;

// --- Iconos Disponibles ---
const ICONS = {
  wallet: Wallet, creditcard: CreditCard, smartphone: Smartphone,
  building2: Building2, briefcase: Briefcase, car: Car,
  utensils: Utensils, film: Film, heart: Heart, book: Book,
  shirt: Shirt, 'minus-circle': MinusCircle, 'plus-circle': PlusCircle,
  'trending-up': TrendingUp, laptop: Laptop, home: Home
};

const getIcon = (iconName) => {
  const IconComponent = ICONS[iconName] || Wallet;
  return <IconComponent />;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};


// --- COMPONENTES DE VISTA ---

const HomeView = ({ stats, transactions, onAddTransactionClick, onShowAllTransactions }) => (
  <div className="pb-24">
    {/* Header con balance total */}
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 mb-6 shadow-lg text-white">
      <p className="text-white/80 text-sm mb-1">Balance Total</p>
      <h2 className="text-white text-3xl font-bold mb-4">
        {formatCurrency(stats.totalBalance || 0)}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 backdrop-blur rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUp className="w-4 h-4 text-green-300" />
            <span className="text-white/80 text-xs">Ingresos (mes)</span>
          </div>
          <p className="text-white font-semibold">
            {formatCurrency(stats.monthlyIncome || 0)}
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDown className="w-4 h-4 text-red-300" />
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
          onClick={() => onAddTransactionClick('income')}
          className="bg-green-100 p-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="bg-green-500 p-2 rounded-xl"><Plus className="w-5 h-5 text-white" /></div>
          <span className="text-gray-800 font-medium">Ingreso</span>
        </button>
        <button
          onClick={() => onAddTransactionClick('expense')}
          className="bg-red-100 p-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="bg-red-500 p-2 rounded-xl"><MinusCircle className="w-5 h-5 text-white" /></div>
          <span className="text-gray-800 font-medium">Gasto</span>
        </button>
      </div>
    </div>

    {/* Transacciones recientes */}
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-600 text-sm font-medium">Transacciones Recientes</h3>
        <button onClick={onShowAllTransactions} className="text-blue-500 text-sm font-medium">Ver todas</button>
      </div>
      <div className="space-y-2">
        {transactions.slice(0, 5).map((t) => {
          const Icon = getIcon(t.category_icon);
          return (
            <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${t.category_color}20` }}>
                    <Icon.type className="w-5 h-5" style={{ color: t.category_color }} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t.description || t.category_name}</p>
                    <p className="text-xs text-gray-500">{t.account_name} • {new Date(t.date).toLocaleDateString('es-MX')}</p>
                  </div>
                </div>
                <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const AccountsView = ({ accounts, onAddAccountClick }) => (
  <div className="pb-24">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800">Mis Cuentas</h2>
      <button onClick={onAddAccountClick} className="bg-blue-500 p-2 rounded-xl shadow-lg active:scale-95 transition-transform">
        <Plus className="w-5 h-5 text-white" />
      </button>
    </div>
    <div className="grid gap-4">
      {accounts.map((account) => {
        const Icon = getIcon(account.icon);
        return (
          <div key={account.id} className="bg-white rounded-2xl p-4 shadow-sm">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${account.color}20` }}>
                    <Icon.type className="w-6 h-6" style={{ color: account.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{account.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                  </div>
                </div>
                <p className="font-bold text-lg text-gray-800">{formatCurrency(account.balance)}</p>
              </div>
          </div>
        );
      })}
    </div>
  </div>
);

const TransactionsView = ({ transactions, onAddTransactionClick }) => (
    <div className="pb-24">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Transacciones</h2>
            <button onClick={() => onAddTransactionClick('expense')} className="bg-blue-500 p-2 rounded-xl shadow-lg active:scale-95 transition-transform">
                <Plus className="w-5 h-5 text-white" />
            </button>
        </div>
        <div className="space-y-3">
            {transactions.map((t) => {
                const Icon = getIcon(t.category_icon);
                return (
                    <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl" style={{ backgroundColor: `${t.category_color}20` }}>
                                    <Icon.type className="w-5 h-5" style={{ color: t.category_color }} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{t.description || t.category_name}</p>
                                    <p className="text-xs text-gray-500">{t.account_name} • {new Date(t.date).toLocaleDateString('es-MX')}</p>
                                </div>
                            </div>
                            <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const StatsView = () => (
    <div className="pb-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas</h2>
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <PieChart className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Gráficos Próximamente</h3>
            <p className="text-gray-500 mt-2">
                Estamos trabajando para traerte análisis detallados de tus finanzas.
            </p>
        </div>
    </div>
);


// --- COMPONENTE MODAL ---

const AddModal = ({ modalType, show, onClose, onSave, accounts, categories, formData, setFormData }) => {
  if (!show) return null;

  const isAccount = modalType === 'account';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransactionTypeChange = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isAccount ? 'Nueva Cuenta' : 'Nueva Transacción'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {isAccount ? (
          <div className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre de la cuenta" className="w-full p-3 border rounded-xl" autoFocus />
            <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-3 border rounded-xl">
              <option value="checking">Cuenta Corriente</option>
              <option value="savings">Ahorro</option>
              <option value="credit">Crédito</option>
              <option value="cash">Efectivo</option>
            </select>
            <input type="number" name="balance" value={formData.balance} onChange={handleInputChange} placeholder="Balance Inicial" className="w-full p-3 border rounded-xl" />
            <button onClick={() => onSave(formData)} disabled={!formData.name} className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium disabled:opacity-50">Crear Cuenta</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleTransactionTypeChange('income')} className={`py-2 rounded-xl font-medium ${formData.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>Ingreso</button>
                <button onClick={() => handleTransactionTypeChange('expense')} className={`py-2 rounded-xl font-medium ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>Gasto</button>
            </div>
            <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Monto" className="w-full p-3 border rounded-xl" autoFocus />
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Descripción (opcional)" className="w-full p-3 border rounded-xl" />
            <select name="account_id" value={formData.account_id} onChange={handleInputChange} className="w-full p-3 border rounded-xl">
              <option value="">Seleccionar cuenta</option>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
            <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full p-3 border rounded-xl">
              <option value="">Seleccionar categoría</option>
              {categories.filter(cat => cat.type === formData.type).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-3 border rounded-xl" />
            <button onClick={() => onSave(formData)} disabled={!formData.amount || !formData.account_id || !formData.category_id} className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium disabled:opacity-50">Agregar Transacción</button>
          </div>
        )}
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('transaction'); // 'account' or 'transaction'

  const initialAccountState = { name: '', type: 'checking', balance: '', color: '#3b82f6', icon: 'wallet' };
  const initialTransactionState = { type: 'expense', amount: '', description: '', account_id: '', category_id: '', date: new Date().toISOString().split('T')[0] };

  const [formData, setFormData] = useState(initialTransactionState);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetchAccounts();
    fetchTransactions();
    fetchCategories();
    fetchStats();
  };
  
  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts`);
      setAccounts(await response.json());
    } catch (error) { console.error('Error fetching accounts:', error); }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      setTransactions(await response.json());
    } catch (error) { console.error('Error fetching transactions:', error); }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      setCategories(await response.json());
    } catch (error) { console.error('Error fetching categories:', error); }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      setStats(await response.json());
    } catch (error) { console.error('Error fetching stats:', error); }
  };

  const handleSave = async (data) => {
    const isAccount = modalType === 'account';
    const url = isAccount ? `${API_URL}/accounts` : `${API_URL}/transactions`;
    const body = isAccount ? { ...data, balance: parseFloat(data.balance) || 0 } : { ...data, amount: parseFloat(data.amount) };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        setShowAddModal(false);
        fetchData(); // Recargar todos los datos
      }
    } catch (error) {
      console.error(`Error adding ${modalType}:`, error);
    }
  };
  
  const openModal = (type, transactionType = 'expense') => {
      setModalType(type);
      if (type === 'account') {
          setFormData(initialAccountState);
      } else {
          setFormData({ ...initialTransactionState, type: transactionType });
      }
      setShowAddModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts':
        return <AccountsView accounts={accounts} onAddAccountClick={() => openModal('account')} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} onAddTransactionClick={(type) => openModal('transaction', type)} />;
      case 'stats':
        return <StatsView />;
      case 'home':
      default:
        return <HomeView 
                  stats={stats} 
                  transactions={transactions} 
                  onAddTransactionClick={(type) => openModal('transaction', type)}
                  onShowAllTransactions={() => setActiveTab('transactions')}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white px-4 pt-10 pb-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Mis Finanzas</h1>
      </header>

      <main className="px-4 py-4">
        {renderContent()}
      </main>

      <AddModal 
        show={showAddModal}
        modalType={modalType}
        onClose={() => setShowAddModal(false)}
        onSave={handleSave}
        accounts={accounts}
        categories={categories}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg">
        <div className="grid grid-cols-4">
          {[{id: 'home', icon: Home}, {id: 'accounts', icon: Wallet}, {id: 'transactions', icon: DollarSign}, {id: 'stats', icon: PieChart}].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 transition-colors duration-200 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs mt-1 capitalize">{tab.id}</span>
            </button>
          ))}
        </div>
      </nav>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default App;