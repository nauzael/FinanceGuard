
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  Users, 
  Home, 
  CreditCard, 
  History, 
  Camera, 
  ChevronRight, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Moon,
  Sun,
  Landmark,
  Pencil,
  Settings,
  Download,
  Upload,
  Trash2,
  TrendingUp,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { StorageService } from './services/storage';
import { 
  Contact, 
  Loan, 
  Transaction, 
  TransactionType, 
  LoanStatus, 
  DashboardStats,
  BankAccount
} from './types';

// --- Constants ---
const COLOMBIAN_BANKS = [
    { id: 'efectivo', name: 'Efectivo', color: '#22c55e', textColor: 'text-white' },
    { id: 'bancolombia', name: 'Bancolombia', color: '#FDDA24', textColor: 'text-black' },
    { id: 'nequi', name: 'Nequi', color: '#200020', textColor: 'text-white' },
    { id: 'daviplata', name: 'Daviplata', color: '#EF3340', textColor: 'text-white' },
    { id: 'davivienda', name: 'Davivienda', color: '#EF3340', textColor: 'text-white' },
    { id: 'bbva', name: 'BBVA', color: '#004481', textColor: 'text-white' },
    { id: 'bogota', name: 'Banco de Bogotá', color: '#0033A0', textColor: 'text-white' },
    { id: 'nubank', name: 'Nu', color: '#820AD1', textColor: 'text-white' },
    { id: 'lulo', name: 'Lulo Bank', color: '#00F000', textColor: 'text-black' },
    { id: 'cajasocial', name: 'Caja Social', color: '#004885', textColor: 'text-white' },
    { id: 'otro', name: 'Otro', color: '#64748b', textColor: 'text-white' }
];

// --- Utility Components ---

const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 transition-colors ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, variant = 'primary', className = '', children, disabled = false, type = 'button' }: any) => {
  const baseStyle = "px-4 py-3 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants: any = {
    primary: "bg-brand-600 text-white shadow-brand-200 dark:shadow-none shadow-md hover:bg-brand-700 disabled:opacity-50",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30",
    success: "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700",
    outline: "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
    <input className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white" {...props} />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
    <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" {...props}>
      {children}
    </select>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const ActionMenu = ({ isOpen, onClose, onAddIncome, onAddExpense, onAddLoan }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-4 space-y-3 animate-in slide-in-from-bottom duration-200 mb-16 sm:mb-0" onClick={e => e.stopPropagation()}>
                <h3 className="text-center font-bold text-slate-900 dark:text-slate-100 mb-2">¿Qué quieres registrar?</h3>
                
                <button onClick={() => { onAddIncome(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-emerald-500"><TrendingUp size={20} /></div>
                    <div className="text-left">
                        <span className="block font-bold">Registrar Ingreso</span>
                        <span className="text-xs opacity-70">Aumenta tu saldo (Sueldo, regalo, etc.)</span>
                    </div>
                </button>

                <button onClick={() => { onAddExpense(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-red-500"><Minus size={20} /></div>
                    <div className="text-left">
                        <span className="block font-bold">Registrar Gasto</span>
                        <span className="text-xs opacity-70">Disminuye tu saldo (Compras, servicios)</span>
                    </div>
                </button>

                <button onClick={() => { onAddLoan(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-blue-500"><DollarSign size={20} /></div>
                    <div className="text-left">
                        <span className="block font-bold">Nuevo Préstamo</span>
                        <span className="text-xs opacity-70">Dinero que prestas o te prestan</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

// --- Main App Logic ---

enum View {
  DASHBOARD,
  EXPENSES,
  LOANS,
  CONTACTS,
  LOAN_DETAIL,
  ACCOUNTS
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [stats, setStats] = useState<DashboardStats>({ totalExpenses: 0, totalLoansGiven: 0, totalLoansTaken: 0, activeLoansCount: 0, totalBalance: 0 });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); 
  const [loans, setLoans] = useState<Loan[]>([]); 
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Modal States
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [imageViewOpen, setImageViewOpen] = useState<string | null>(null);
  
  // Selection States
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  // Form Previews
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Data
  const refreshData = () => {
    const allTrans = StorageService.getTransactions();
    const allLoans = StorageService.getLoans();
    const allAccounts = StorageService.getAccounts();
    
    // Auto-create "Efectivo" if no accounts exist
    if (allAccounts.length === 0) {
        const defaultCash: BankAccount = {
            id: 'default-cash',
            name: 'Mi Efectivo',
            bank: 'Efectivo',
            type: 'CASH',
            balance: 0,
            color: '#22c55e'
        };
        StorageService.addAccount(defaultCash);
        setAccounts([defaultCash, ...allAccounts]);
    } else {
        setAccounts(allAccounts);
    }

    setStats(StorageService.getStats());
    setRecentTransactions(allTrans.slice(0, 10)); 
    setTransactions(allTrans);
    setLoans(allLoans);
    setActiveLoans(allLoans.filter(l => l.status !== LoanStatus.PAID));
    setContacts(StorageService.getContacts());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Theme Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Actions ---

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeguard_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (StorageService.importData(content)) {
        alert('Datos restaurados correctamente');
        refreshData();
        setIsSettingsOpen(false);
      } else {
        alert('Error al importar el archivo. Formato inválido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearData = () => {
      if (confirm('¿Estás seguro de borrar todos los datos? Esta acción no se puede deshacer.')) {
          StorageService.clearAll();
          refreshData();
          setIsSettingsOpen(false);
      }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const bankId = (form.elements.namedItem('bank') as HTMLSelectElement).value;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value as any;
    const balance = parseFloat((form.elements.namedItem('balance') as HTMLInputElement).value) || 0;

    const bankInfo = COLOMBIAN_BANKS.find(b => b.id === bankId) || COLOMBIAN_BANKS[COLOMBIAN_BANKS.length - 1];

    StorageService.addAccount({
        id: crypto.randomUUID(),
        name,
        bank: bankInfo.name,
        type,
        balance,
        color: bankInfo.color
    });
    setIsAddAccountOpen(false);
    refreshData();
  };

  const handleEditAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const bankId = (form.elements.namedItem('bank') as HTMLSelectElement).value;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value as any;
    const balance = parseFloat((form.elements.namedItem('balance') as HTMLInputElement).value) || 0;

    const bankInfo = COLOMBIAN_BANKS.find(b => b.id === bankId) || COLOMBIAN_BANKS[COLOMBIAN_BANKS.length - 1];

    const updatedAccount: BankAccount = {
        ...selectedAccount,
        name,
        bank: bankInfo.name,
        type,
        balance,
        color: bankInfo.color
    };

    StorageService.updateAccount(updatedAccount);
    setIsEditAccountOpen(false);
    setSelectedAccount(null);
    refreshData();
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const desc = (form.elements.namedItem('description') as HTMLInputElement).value;
    const dateStr = (form.elements.namedItem('date') as HTMLInputElement).value;
    const accountId = (form.elements.namedItem('account') as HTMLSelectElement).value;
    const date = new Date(dateStr).getTime();
    
    StorageService.addTransaction({
        id: crypto.randomUUID(),
        type: TransactionType.INCOME,
        amount,
        description: desc,
        date,
        accountId: accountId || undefined
    });
    setIsAddIncomeOpen(false);
    refreshData();
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const desc = (form.elements.namedItem('description') as HTMLInputElement).value;
    const dateStr = (form.elements.namedItem('date') as HTMLInputElement).value;
    const accountId = (form.elements.namedItem('account') as HTMLSelectElement).value;
    const date = new Date(dateStr).getTime();
    
    StorageService.addTransaction({
        id: crypto.randomUUID(),
        type: TransactionType.EXPENSE,
        amount,
        description: desc,
        date,
        evidenceUrl: formImagePreview || undefined,
        accountId: accountId || undefined
    });
    
    setIsAddExpenseOpen(false);
    setFormImagePreview(null);
    refreshData();
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const relation = (form.elements.namedItem('relation') as HTMLInputElement).value;

    StorageService.addContact({
      id: crypto.randomUUID(),
      name,
      phone,
      relation,
      createdAt: Date.now()
    });
    setIsAddContactOpen(false);
    refreshData();
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const contactName = (form.elements.namedItem('contactName') as HTMLInputElement).value.trim();
    if (!contactName) {
        alert("El nombre de la persona es obligatorio");
        return;
    }

    let contactId = '';
    const existingContact = contacts.find(c => c.name.toLowerCase() === contactName.toLowerCase());

    if (existingContact) {
        contactId = existingContact.id;
    } else {
        const newContact: Contact = {
            id: crypto.randomUUID(),
            name: contactName,
            relation: 'Préstamo',
            createdAt: Date.now()
        };
        StorageService.addContact(newContact);
        contactId = newContact.id;
    }

    const type = (form.elements.namedItem('type') as HTMLSelectElement).value as 'LENT' | 'BORROWED';
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const interest = parseFloat((form.elements.namedItem('interest') as HTMLInputElement).value) || 0;
    const dateStr = (form.elements.namedItem('date') as HTMLInputElement).value;
    const dueDateStr = (form.elements.namedItem('dueDate') as HTMLInputElement).value;
    const desc = (form.elements.namedItem('description') as HTMLInputElement).value;
    const accountId = (form.elements.namedItem('account') as HTMLSelectElement).value;

    const totalAmount = amount + (amount * (interest / 100));

    const newLoan: Loan = {
        id: crypto.randomUUID(),
        contactId,
        type,
        originalAmount: amount,
        interestRate: interest,
        totalAmountWithInterest: totalAmount,
        remainingAmount: totalAmount,
        startDate: new Date(dateStr).getTime(),
        dueDate: dueDateStr ? new Date(dueDateStr).getTime() : undefined,
        status: LoanStatus.ACTIVE,
        description: desc,
        evidenceUrl: formImagePreview || undefined,
        accountId: accountId || undefined
    };

    StorageService.addLoan(newLoan);
    setIsAddLoanOpen(false);
    setFormImagePreview(null);
    refreshData();
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    const form = e.target as HTMLFormElement;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const dateStr = (form.elements.namedItem('date') as HTMLInputElement).value;
    const accountId = (form.elements.namedItem('account') as HTMLSelectElement).value;
    const paymentType = (form.elements.namedItem('paymentType') as HTMLSelectElement).value;

    StorageService.registerLoanPayment(
        selectedLoan.id, 
        amount, 
        new Date(dateStr).getTime(), 
        accountId || undefined, 
        formImagePreview || undefined,
        paymentType
    );
    
    setIsAddPaymentOpen(false);
    setFormImagePreview(null);
    const updatedLoans = StorageService.getLoans();
    const updated = updatedLoans.find(l => l.id === selectedLoan.id) || null;
    setSelectedLoan(updated);
    refreshData();
  };

  // --- Sub-Components for Views ---

  const Dashboard = () => {
    const bankAccounts = accounts.filter(a => a.type !== 'CASH');
    const totalInBanks = bankAccounts.reduce((sum, a) => sum + a.balance, 0);

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-300">
          
          {/* Accounts Summary */}
          <div>
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Landmark size={16} className="text-brand-500" />
                    Mis Cuentas
                </h3>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">${totalInBanks.toLocaleString()}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <button 
                    onClick={() => setIsAddAccountOpen(true)}
                    className="min-w-[100px] h-[100px] flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <Plus size={24} />
                    <span className="text-xs font-medium">Agregar</span>
                </button>
                {bankAccounts.map(acc => {
                    const bankInfo = COLOMBIAN_BANKS.find(b => b.name === acc.bank) || { textColor: 'text-white' };
                    return (
                        <div 
                            key={acc.id} 
                            onClick={() => { setSelectedAccount(acc); setIsEditAccountOpen(true); }}
                            className="min-w-[160px] p-4 rounded-xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
                            style={{ backgroundColor: acc.color }}
                        >
                            <div className={`absolute top-0 right-0 p-2 opacity-30 ${bankInfo.textColor}`}>
                                {acc.type === 'CASH' ? <Wallet size={40} /> : <Landmark size={40} />}
                            </div>
                            <div className={bankInfo.textColor}>
                                <p className="text-xs font-medium opacity-90">{acc.bank}</p>
                                <p className="font-bold truncate">{acc.name}</p>
                            </div>
                            <p className={`text-lg font-bold mt-2 ${bankInfo.textColor}`}>${acc.balance.toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <ArrowUpRight size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Me Deben</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">${stats.totalLoansGiven.toLocaleString()}</p>
            </Card>
            <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <ArrowDownLeft size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Yo Debo</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">${stats.totalLoansTaken.toLocaleString()}</p>
            </Card>
          </div>

          {/* Active Loans */}
          {activeLoans.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" />
                Préstamos Activos
              </h3>
              <div className="space-y-3">
                 {activeLoans.slice(0, 3).map(loan => {
                   const contact = contacts.find(c => c.id === loan.contactId);
                   return (
                    <div key={loan.id} onClick={() => { setSelectedLoan(loan); setCurrentView(View.LOAN_DETAIL); }} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${loan.type === 'LENT' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                            {contact?.name.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{contact?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {loan.dueDate ? `Vence: ${new Date(loan.dueDate).toLocaleDateString()}` : 'Sin fecha límite'}
                            </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${loan.type === 'LENT' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            ${loan.remainingAmount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase">{loan.type === 'LENT' ? 'Te deben' : 'Debes'}</p>
                      </div>
                    </div>
                   )
                 })}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <History size={16} className="text-slate-400" />
                Movimientos Recientes
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
                {recentTransactions.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400">Sin movimientos aún</div>
                ) : (
                    recentTransactions.map(t => (
                        <div key={t.id} className="p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                    t.type === TransactionType.EXPENSE 
                                    ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' 
                                    : t.type === TransactionType.INCOME
                                    ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400'
                                    : t.type === TransactionType.LOAN_PAYMENT 
                                    ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400' 
                                    : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                    {t.type === TransactionType.EXPENSE ? <Minus size={14}/> : t.type === TransactionType.INCOME ? <TrendingUp size={14}/> : <DollarSign size={14}/>}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1 flex items-center gap-1.5">
                                        {t.description}
                                        {t.evidenceUrl && <ImageIcon size={12} className="text-brand-500" />}
                                    </p>
                                    <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                 <span className={`text-sm font-bold ${t.type === TransactionType.EXPENSE || t.type === TransactionType.LOAN_GIVEN ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {t.type === TransactionType.EXPENSE || t.type === TransactionType.LOAN_GIVEN ? '-' : '+'}${t.amount.toLocaleString()}
                                </span>
                                <div className="flex items-center gap-2">
                                    {t.evidenceUrl && (
                                        <button onClick={() => setImageViewOpen(t.evidenceUrl!)} className="p-1 rounded bg-brand-50 dark:bg-brand-900/20 text-brand-600">
                                            <Eye size={10} />
                                        </button>
                                    )}
                                    {t.accountId && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                                            {accounts.find(a => a.id === t.accountId)?.bank}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>
    );
  };

  const ExpensesView = () => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE).sort((a,b) => b.date - a.date);
    return (
        <div className="pb-20 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Mis Gastos</h2>
                <Button variant="secondary" onClick={() => setIsAddExpenseOpen(true)} className="py-2 px-3 text-sm">
                    <Plus size={16} /> Nuevo
                </Button>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
                {expenses.length === 0 ? <div className="p-8 text-center text-slate-400">No hay gastos registrados</div> : 
                 expenses.map(t => (
                    <div key={t.id} className="p-3 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                <Minus size={14}/>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    {t.description}
                                    {t.evidenceUrl && <ImageIcon size={12} className="text-brand-500" />}
                                </p>
                                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                ${t.amount.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2">
                                {t.evidenceUrl && (
                                    <button onClick={() => setImageViewOpen(t.evidenceUrl!)} className="p-1 rounded bg-brand-50 dark:bg-brand-900/20 text-brand-600">
                                        <Eye size={10} />
                                    </button>
                                )}
                                {t.accountId && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                                        {accounts.find(a => a.id === t.accountId)?.bank}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                 ))
                }
            </div>
        </div>
    );
  };

  const LoansView = () => {
    const [filter, setFilter] = useState<'ALL' | 'LENT' | 'BORROWED'>('ALL');
    const filteredLoans = loans.filter(l => {
        if (filter === 'ALL') return true;
        return l.type === filter;
    });

    return (
        <div className="pb-20 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Préstamos</h2>
                <Button variant="secondary" onClick={() => setIsAddLoanOpen(true)} className="py-2 px-3 text-sm">
                    <Plus size={16} /> Nuevo
                </Button>
            </div>
            
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4">
                {(['ALL', 'LENT', 'BORROWED'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        {f === 'ALL' ? 'Todos' : f === 'LENT' ? 'Me Deben' : 'Debo'}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredLoans.length === 0 ? <div className="p-8 text-center text-slate-400">No hay préstamos</div> :
                 filteredLoans.map(loan => {
                    const contact = contacts.find(c => c.id === loan.contactId);
                    return (
                        <div key={loan.id} onClick={() => { setSelectedLoan(loan); setCurrentView(View.LOAN_DETAIL); }} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center cursor-pointer active:scale-95 transition-transform">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${loan.type === 'LENT' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                    {contact?.name.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{contact?.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {loan.status === LoanStatus.PAID ? 'Pagado' : (loan.dueDate ? `Vence: ${new Date(loan.dueDate).toLocaleDateString()}` : 'Sin fecha límite')}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm ${loan.type === 'LENT' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                    ${loan.remainingAmount.toLocaleString()}
                                </p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${loan.status === LoanStatus.PAID ? 'bg-slate-100 text-slate-500' : 'bg-transparent text-slate-400'}`}>
                                    {loan.status === LoanStatus.PAID ? 'Cerrado' : 'Activo'}
                                </span>
                            </div>
                        </div>
                    );
                 })
                }
            </div>
        </div>
    );
  };

  const AccountsView = () => {
      const bankAccounts = accounts.filter(a => a.type !== 'CASH');
      const totalInBanks = bankAccounts.reduce((sum, a) => sum + a.balance, 0);

      return (
          <div className="pb-20 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Mis Cuentas</h2>
                <Button variant="secondary" onClick={() => setIsAddAccountOpen(true)} className="py-2 px-3 text-sm">
                    <Plus size={16} /> Nueva
                </Button>
            </div>
            
            <Card className="bg-slate-900 dark:bg-slate-800 text-white mb-6">
                <p className="text-sm opacity-70 mb-1">Saldo Total en Bancos</p>
                <p className="text-3xl font-bold">${totalInBanks.toLocaleString()}</p>
            </Card>

            <div className="grid grid-cols-1 gap-4">
                {bankAccounts.map(acc => {
                     const bankInfo = COLOMBIAN_BANKS.find(b => b.name === acc.bank) || { textColor: 'text-white' };
                     return (
                         <div key={acc.id} onClick={() => { setSelectedAccount(acc); setIsEditAccountOpen(true); }} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer active:scale-95 transition-transform">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm" style={{ backgroundColor: acc.color }}>
                                    {acc.type === 'CASH' ? <Wallet size={20} className={bankInfo.textColor} /> : <Landmark size={20} className={bankInfo.textColor} />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{acc.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{acc.bank} • {acc.type === 'SAVINGS' ? 'Ahorros' : acc.type === 'DIGITAL' ? 'Digital' : acc.type === 'CURRENT' ? 'Corriente' : 'Efectivo'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">${acc.balance.toLocaleString()}</p>
                                <ChevronRight className="text-slate-300" size={18} />
                            </div>
                         </div>
                     )
                })}
            </div>
          </div>
      )
  };

  const LoanDetailView = () => {
    if (!selectedLoan) return null;
    const contact = contacts.find(c => c.id === selectedLoan.contactId);
    const paidAmount = selectedLoan.totalAmountWithInterest - selectedLoan.remainingAmount;
    const progress = (paidAmount / selectedLoan.totalAmountWithInterest) * 100;
    const history = StorageService.getTransactions().filter(t => t.loanId === selectedLoan.id).sort((a,b) => b.date - a.date);

    return (
        <div className="pb-20 animate-in slide-in-from-right duration-200">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setCurrentView(View.LOANS)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                    <ArrowDownLeft className="rotate-90" size={20} />
                </button>
                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Detalle del Préstamo</h2>
            </div>
            
            <Card className="mb-4 overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-1 h-full ${selectedLoan.type === 'LENT' ? 'bg-brand-500' : 'bg-orange-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedLoan.type === 'LENT' ? 'Le prestaste a' : 'Te prestó'}</p>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{contact?.name}</h1>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedLoan.status === LoanStatus.PAID ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {selectedLoan.status === LoanStatus.PAID ? 'PAGADO' : 'ACTIVO'}
                    </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Monto Original</p>
                        <p className="font-medium text-slate-800 dark:text-slate-200">${selectedLoan.originalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Con Interés ({selectedLoan.interestRate}%)</p>
                        <p className="font-medium text-brand-600 dark:text-brand-400">${selectedLoan.totalAmountWithInterest.toLocaleString()}</p>
                    </div>
                </div>

                {selectedLoan.evidenceUrl && (
                    <div className="mb-4">
                        <p className="text-[10px] text-slate-400 uppercase mb-1">Evidencia Inicial</p>
                        <div className="relative h-24 w-full rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 cursor-pointer" onClick={() => setImageViewOpen(selectedLoan.evidenceUrl!)}>
                            <img src={selectedLoan.evidenceUrl} className="w-full h-full object-cover" alt="Evidencia" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Eye className="text-white" size={20} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Restante</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">${selectedLoan.remainingAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>{progress.toFixed(0)}% Pagado</span>
                        <span>{selectedLoan.dueDate ? `Vence: ${new Date(selectedLoan.dueDate).toLocaleDateString()}` : 'Sin vencimiento'}</span>
                    </div>
                </div>
            </Card>

            {selectedLoan.status === LoanStatus.ACTIVE && (
                <Button onClick={() => setIsAddPaymentOpen(true)} className="w-full mb-6">
                    <Plus size={18} /> Registrar Abono
                </Button>
            )}

            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm flex items-center gap-2">
                <History size={14}/> Historial de Pagos
            </h3>
            <div className="space-y-3">
                {history.map(t => (
                    <div key={t.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    {t.type === TransactionType.LOAN_GIVEN || t.type === TransactionType.LOAN_TAKEN ? <Wallet size={14}/> : <CheckCircle size={14}/>}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.description}</p>
                                    <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">${t.amount.toLocaleString()}</span>
                        </div>
                        {t.evidenceUrl && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer" onClick={() => setImageViewOpen(t.evidenceUrl!)}>
                                <div className="w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src={t.evidenceUrl} className="w-full h-full object-cover" alt="Pago" />
                                </div>
                                <span className="text-xs text-slate-500 font-medium">Ver comprobante de pago</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const ContactsList = () => (
     <div className="pb-20 animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Directorio</h2>
            <Button variant="secondary" onClick={() => setIsAddContactOpen(true)} className="py-2 px-3 text-sm">
                <Plus size={16} /> Nuevo
            </Button>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {contacts.map(c => (
                <div key={c.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-blue-100 dark:from-brand-900/40 dark:to-blue-900/40 text-brand-700 dark:text-brand-400 rounded-full flex items-center justify-center font-bold">
                            {c.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{c.relation || 'Sin relación'} • {c.phone || 'Sin teléfono'}</p>
                        </div>
                    </div>
                </div>
            ))}
            {contacts.length === 0 && <div className="text-center text-slate-400 py-10">No tienes contactos agregados</div>}
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <Wallet size={18} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">FinanceGuard</h1>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Settings size={20} />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {currentView === View.DASHBOARD && <Dashboard />}
        {currentView === View.EXPENSES && <ExpensesView />}
        {currentView === View.LOANS && <LoansView />}
        {currentView === View.LOAN_DETAIL && <LoanDetailView />}
        {currentView === View.CONTACTS && <ContactsList />}
        {currentView === View.ACCOUNTS && <AccountsView />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex justify-between items-center z-40 safe-area-bottom">
        <button onClick={() => setCurrentView(View.DASHBOARD)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.DASHBOARD ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <Home size={24} strokeWidth={currentView === View.DASHBOARD ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Inicio</span>
        </button>
        
        <button onClick={() => setCurrentView(View.ACCOUNTS)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.ACCOUNTS ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <Wallet size={24} strokeWidth={currentView === View.ACCOUNTS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Cuentas</span>
        </button>

        <div className="relative -top-5">
            <button onClick={() => setIsActionMenuOpen(true)} className="bg-brand-600 text-white p-4 rounded-full shadow-lg shadow-brand-200 dark:shadow-brand-900/20 active:scale-95 transition-transform hover:bg-brand-700">
                <Plus size={24} />
            </button>
        </div>

        <button onClick={() => setCurrentView(View.EXPENSES)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.EXPENSES ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <CreditCard size={24} strokeWidth={currentView === View.EXPENSES ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Gastos</span>
        </button>

        <button onClick={() => setCurrentView(View.LOANS)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.LOANS ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <DollarSign size={24} strokeWidth={currentView === View.LOANS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Préstamos</span>
        </button>
      </nav>

      {/* Visor de Imagen Full Screen */}
      {imageViewOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in" onClick={() => setImageViewOpen(null)}>
              <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white" onClick={() => setImageViewOpen(null)}>
                  <X size={24} />
              </button>
              <img src={imageViewOpen} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" alt="Evidencia Expandida" />
              <p className="text-white/60 text-sm mt-4">Toca en cualquier lugar para cerrar</p>
          </div>
      )}

      {/* Modals */}

      <ActionMenu 
        isOpen={isActionMenuOpen} 
        onClose={() => setIsActionMenuOpen(false)} 
        onAddIncome={() => setIsAddIncomeOpen(true)}
        onAddExpense={() => setIsAddExpenseOpen(true)}
        onAddLoan={() => setIsAddLoanOpen(true)}
      />

      <Modal isOpen={isAddIncomeOpen} onClose={() => setIsAddIncomeOpen(false)} title="Registrar Ingreso">
          <form onSubmit={handleAddIncome} className="space-y-4">
              <Input name="amount" type="number" step="0.01" label="Monto" placeholder="0.00" required autoFocus />
              <Input name="description" type="text" label="Descripción" placeholder="Ej. Sueldo, Venta, Regalo" required />
              <Select name="account" label="Recibir en (Cuenta / Efectivo)" required>
                  {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - ${a.balance.toLocaleString()}</option>
                  ))}
              </Select>
              <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
              <Button type="submit" variant="success" className="w-full">Guardar Ingreso</Button>
          </form>
      </Modal>

      <Modal isOpen={isAddExpenseOpen} onClose={() => { setIsAddExpenseOpen(false); setFormImagePreview(null); }} title="Registrar Gasto">
        <form onSubmit={handleAddExpense} className="space-y-4">
            <Input name="amount" type="number" step="0.01" label="Monto" placeholder="0.00" required autoFocus />
            <Input name="description" type="text" label="Descripción" placeholder="Ej. Comida, Transporte" required />
            <Select name="account" label="Pagar desde (Cuenta / Efectivo)" required>
                  {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - ${a.balance.toLocaleString()}</option>
                  ))}
            </Select>
            <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Evidencia (Opcional)</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer group">
                    <input type="file" name="evidence" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {formImagePreview ? (
                        <div className="flex flex-col items-center">
                            <img src={formImagePreview} className="h-24 w-auto rounded-lg mb-2 shadow-sm" alt="Preview" />
                            <span className="text-xs text-brand-600 font-bold">Imagen Cargada Correctamente</span>
                        </div>
                    ) : (
                        <>
                            <Camera className="mx-auto text-slate-400 group-hover:text-brand-500 mb-2 transition-colors" />
                            <span className="text-sm text-slate-500 dark:text-slate-400">Toca para tomar foto o subir</span>
                        </>
                    )}
                </div>
            </div>
            <Button type="submit" className="w-full">Guardar Gasto</Button>
        </form>
      </Modal>

      <Modal isOpen={isAddLoanOpen} onClose={() => { setIsAddLoanOpen(false); setFormImagePreview(null); }} title="Nuevo Préstamo">
        <form onSubmit={handleAddLoan} className="space-y-4">
            <Select name="type" label="Tipo de Movimiento">
                <option value="LENT">Prestar (Me deben)</option>
                <option value="BORROWED">Pedir Prestado (Debo)</option>
            </Select>
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Persona</label>
                <input list="contacts-list" name="contactName" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" placeholder="Escribe el nombre..." required />
                <datalist id="contacts-list">{contacts.map(c => <option key={c.id} value={c.name} />)}</datalist>
            </div>
            <Input name="amount" type="number" step="0.01" label="Monto" placeholder="0.00" required />
            <Select name="account" label="Cuenta de Origen / Efectivo" required>
                  {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - ${a.balance.toLocaleString()}</option>
                  ))}
            </Select>
            <div className="grid grid-cols-2 gap-4">
                <Input name="interest" type="number" step="0.1" label="Interés %" defaultValue="0" />
                <Input name="dueDate" type="date" label="Fecha Límite (Opcional)" />
            </div>
            <Input name="date" type="date" label="Fecha Inicio" defaultValue={new Date().toISOString().split('T')[0]} required />
            <Input name="description" type="text" label="Nota / Motivo" placeholder="Ej. Préstamo personal" />
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comprobante / Pagaré (Opcional)</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer group">
                    <input type="file" name="evidence" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {formImagePreview ? (
                        <div className="flex flex-col items-center">
                            <img src={formImagePreview} className="h-24 w-auto rounded-lg mb-2 shadow-sm" alt="Preview" />
                            <span className="text-xs text-brand-600 font-bold">Imagen Cargada</span>
                        </div>
                    ) : (
                        <>
                            <Camera className="mx-auto text-slate-400 group-hover:text-brand-500 mb-2 transition-colors" />
                            <span className="text-sm text-slate-500 dark:text-slate-400">Toca para adjuntar evidencia</span>
                        </>
                    )}
                </div>
            </div>
            <Button type="submit" className="w-full">Crear Préstamo</Button>
        </form>
      </Modal>

      <Modal isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} title="Nueva Cuenta">
          <form onSubmit={handleAddAccount} className="space-y-4">
              <Select name="bank" label="Banco / Entidad" required>
                  {COLOMBIAN_BANKS.filter(b => b.id !== 'efectivo').map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>
              <Input name="name" type="text" label="Nombre de la Cuenta" placeholder="Ej. Ahorros Nómina" required />
              <Select name="type" label="Tipo de Cuenta">
                  <option value="SAVINGS">Ahorros</option>
                  <option value="DIGITAL">Billetera Digital</option>
                  <option value="CURRENT">Corriente</option>
              </Select>
              <Input name="balance" type="number" step="0.01" label="Saldo Inicial" placeholder="0.00" required />
              <Button type="submit" className="w-full">Guardar Cuenta</Button>
          </form>
      </Modal>

      <Modal isOpen={isEditAccountOpen} onClose={() => { setIsEditAccountOpen(false); setSelectedAccount(null); }} title="Editar Cuenta">
          {selectedAccount && (
              <form onSubmit={handleEditAccount} className="space-y-4">
                  <Select name="bank" label="Banco / Entidad" defaultValue={COLOMBIAN_BANKS.find(b => b.name === selectedAccount.bank)?.id || 'otro'} required>
                      {COLOMBIAN_BANKS.filter(b => b.id !== 'efectivo').map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </Select>
                  <Input name="name" type="text" label="Nombre" defaultValue={selectedAccount.name} required />
                  <Input name="balance" type="number" step="0.01" label="Saldo" defaultValue={selectedAccount.balance} required />
                  <Button type="submit" className="w-full">Actualizar Cuenta</Button>
              </form>
          )}
      </Modal>

      <Modal isOpen={isAddPaymentOpen} onClose={() => { setIsAddPaymentOpen(false); setFormImagePreview(null); }} title="Registrar Abono">
        <div className="mb-4 bg-brand-50 dark:bg-brand-900/20 p-3 rounded-lg text-brand-800 dark:text-brand-300 text-sm">
            <p>Deuda actual: <strong>${selectedLoan?.remainingAmount.toLocaleString()}</strong></p>
        </div>
        <form onSubmit={handleAddPayment} className="space-y-4">
            <Input name="amount" type="number" step="0.01" max={selectedLoan?.remainingAmount} label="Monto a Abonar" placeholder="0.00" required autoFocus />
            
            <Select name="paymentType" label="Aplicar pago a:" required>
                <option value="CAPITAL_AND_INTEREST">Capital e Intereses</option>
                <option value="CAPITAL">Solo Capital</option>
                <option value="INTEREST">Solo Intereses</option>
            </Select>

            <Select name="account" label="Cuenta de Pago / Efectivo" required>
                  {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - ${a.balance.toLocaleString()}</option>
                  ))}
            </Select>
            <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comprobante de Pago (Opcional)</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer group">
                    <input type="file" name="evidence" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {formImagePreview ? (
                        <div className="flex flex-col items-center">
                            <img src={formImagePreview} className="h-24 w-auto rounded-lg mb-2 shadow-sm" alt="Preview" />
                            <span className="text-xs text-brand-600 font-bold">Comprobante Cargado</span>
                        </div>
                    ) : (
                        <>
                            <Camera className="mx-auto text-slate-400 group-hover:text-brand-500 mb-2 transition-colors" />
                            <span className="text-sm text-slate-500 dark:text-slate-400">Toca para tomar foto del recibo</span>
                        </>
                    )}
                </div>
            </div>
            <Button type="submit" className="w-full">Registrar Pago</Button>
        </form>
      </Modal>

      <Modal isOpen={isAddContactOpen} onClose={() => setIsAddContactOpen(false)} title="Nuevo Contacto">
        <form onSubmit={handleAddContact} className="space-y-4">
            <Input name="name" type="text" label="Nombre Completo" placeholder="Nombre" required />
            <Input name="relation" type="text" label="Relación" placeholder="Ej. Amigo, Tío, Trabajo" />
            <Input name="phone" type="tel" label="Teléfono" placeholder="Opcional" />
            <Button type="submit" className="w-full">Guardar Contacto</Button>
        </form>
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Configuración">
          <div className="space-y-6">
              <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Backup</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={handleExportData} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex flex-col items-center gap-2 text-blue-700 dark:text-blue-400">
                          <Download size={24} /> <span className="text-sm font-bold">Exportar</span>
                      </button>
                      <button onClick={handleImportClick} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex flex-col items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <Upload size={24} /> <span className="text-sm font-bold">Importar</span>
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImportData} accept=".json" className="hidden" />
                  </div>
              </div>
              <div>
                  <h3 className="text-sm font-bold text-red-500 uppercase mb-3">Peligro</h3>
                  <button onClick={handleClearData} className="w-full p-3 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                      <Trash2 size={20} /> <span className="font-bold">Borrar Todo</span>
                  </button>
              </div>
          </div>
      </Modal>
    </div>
  );
}
