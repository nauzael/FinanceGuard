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
  Trash2
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
    { id: 'bancolombia', name: 'Bancolombia', color: '#FDDA24', textColor: 'text-black' },
    { id: 'nequi', name: 'Nequi', color: '#200020', textColor: 'text-white' },
    { id: 'daviplata', name: 'Daviplata', color: '#EF3340', textColor: 'text-white' },
    { id: 'davivienda', name: 'Davivienda', color: '#EF3340', textColor: 'text-white' },
    { id: 'bbva', name: 'BBVA', color: '#004481', textColor: 'text-white' },
    { id: 'bogota', name: 'Banco de Bogotá', color: '#0033A0', textColor: 'text-white' },
    { id: 'nubank', name: 'Nu', color: '#820AD1', textColor: 'text-white' },
    { id: 'lulo', name: 'Lulo Bank', color: '#00F000', textColor: 'text-black' },
    { id: 'cajasocial', name: 'Caja Social', color: '#004885', textColor: 'text-white' },
    { id: 'efectivo', name: 'Efectivo', color: '#22c55e', textColor: 'text-white' },
    { id: 'otro', name: 'Otro', color: '#64748b', textColor: 'text-white' }
];

// --- Utility Components ---

const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 transition-colors ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, variant = 'primary', className = '', children, disabled = false }: any) => {
  const baseStyle = "px-4 py-3 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants: any = {
    primary: "bg-brand-600 text-white shadow-brand-200 dark:shadow-none shadow-md hover:bg-brand-700 disabled:opacity-50",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30",
    outline: "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
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

const ActionMenu = ({ isOpen, onClose, onAddExpense, onAddLoan }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-4 space-y-3 animate-in slide-in-from-bottom duration-200 mb-16 sm:mb-0" onClick={e => e.stopPropagation()}>
                <h3 className="text-center font-bold text-slate-900 dark:text-slate-100 mb-2">Seleccionar Acción</h3>
                <button onClick={() => { onAddExpense(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm"><Minus size={20} /></div>
                    <span className="font-bold">Registrar Gasto</span>
                </button>
                <button onClick={() => { onAddLoan(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm"><DollarSign size={20} /></div>
                    <span className="font-bold">Nuevo Préstamo</span>
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
  const [transactions, setTransactions] = useState<Transaction[]>([]); // All transactions
  const [loans, setLoans] = useState<Loan[]>([]); // All loans
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
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Selection States
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Data
  const refreshData = () => {
    const allTrans = StorageService.getTransactions();
    const allLoans = StorageService.getLoans();
    setStats(StorageService.getStats());
    setRecentTransactions(allTrans.slice(0, 10)); 
    setTransactions(allTrans);
    setLoans(allLoans);
    setActiveLoans(allLoans.filter(l => l.status !== LoanStatus.PAID));
    setContacts(StorageService.getContacts());
    setAccounts(StorageService.getAccounts());
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
    // Reset input
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

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const desc = (form.elements.namedItem('description') as HTMLInputElement).value;
    const dateStr = (form.elements.namedItem('date') as HTMLInputElement).value;
    const accountId = (form.elements.namedItem('account') as HTMLSelectElement).value;
    const date = new Date(dateStr).getTime();
    
    // Image handling
    const fileInput = form.elements.namedItem('evidence') as HTMLInputElement;
    
    const processTransaction = (imgUrl?: string) => {
        StorageService.addTransaction({
            id: crypto.randomUUID(),
            type: TransactionType.EXPENSE,
            amount,
            description: desc,
            date,
            evidenceUrl: imgUrl,
            accountId: accountId || undefined
        });
        setIsAddExpenseOpen(false);
        refreshData();
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => processTransaction(reader.result as string);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processTransaction();
    }
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
    
    // Auto-register contact logic
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
        // Create new contact
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

    const processLoan = (imgUrl?: string) => {
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
            evidenceUrl: imgUrl,
            accountId: accountId || undefined
        };

        StorageService.addLoan(newLoan);
        setIsAddLoanOpen(false);
        refreshData();
    };

    const fileInput = form.elements.namedItem('evidence') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => processLoan(reader.result as string);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processLoan();
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    const form = e.target as HTMLFormElement;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const dateStr = (form.elements.namedItem('date') as HTMLInputElement).value;
    const accountId = (form.elements.namedItem('account') as HTMLSelectElement).value;

    const processPayment = (imgUrl?: string) => {
        StorageService.registerLoanPayment(
            selectedLoan.id, 
            amount, 
            new Date(dateStr).getTime(), 
            accountId || undefined, 
            imgUrl
        );
        setIsAddPaymentOpen(false);
        // Refresh selected loan data
        const updatedLoans = StorageService.getLoans();
        const updated = updatedLoans.find(l => l.id === selectedLoan.id) || null;
        setSelectedLoan(updated);
        refreshData();
    }

    const fileInput = form.elements.namedItem('evidence') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => processPayment(reader.result as string);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processPayment();
    }
  };

  // --- Sub-Components for Views ---

  const Dashboard = () => (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Accounts Summary */}
      <div>
        <div className="flex justify-between items-center mb-3">
             <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Wallet size={16} className="text-brand-500" />
                Mis Cuentas
            </h3>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">${stats.totalBalance.toLocaleString()}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <button 
                onClick={() => setIsAddAccountOpen(true)}
                className="min-w-[100px] h-[100px] flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <Plus size={24} />
                <span className="text-xs font-medium">Agregar</span>
            </button>
            {accounts.map(acc => {
                const bankInfo = COLOMBIAN_BANKS.find(b => b.name === acc.bank) || { textColor: 'text-white' };
                return (
                    <div 
                        key={acc.id} 
                        className="min-w-[160px] p-4 rounded-xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden"
                        style={{ backgroundColor: acc.color }}
                    >
                        <div className={`absolute top-0 right-0 p-2 opacity-30 ${bankInfo.textColor}`}>
                            <Landmark size={40} />
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

      {/* Upcoming/Due - Simple Simulation */}
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
                                : t.type === TransactionType.LOAN_PAYMENT 
                                ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400' 
                                : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                                {t.type === TransactionType.EXPENSE ? <Minus size={14}/> : <DollarSign size={14}/>}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{t.description}</p>
                                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                             <span className={`text-sm font-bold ${t.type === TransactionType.EXPENSE || t.type === TransactionType.LOAN_GIVEN ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {t.type === TransactionType.EXPENSE || t.type === TransactionType.LOAN_GIVEN ? '-' : '+'}${t.amount.toLocaleString()}
                            </span>
                            {t.accountId && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                                    {accounts.find(a => a.id === t.accountId)?.bank}
                                </span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );

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
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.description}</p>
                                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                ${t.amount.toLocaleString()}
                            </span>
                            {t.accountId && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                                    {accounts.find(a => a.id === t.accountId)?.bank}
                                </span>
                            )}
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
            
            {/* Filter Tabs */}
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
      return (
          <div className="pb-20 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Mis Cuentas</h2>
                <Button variant="secondary" onClick={() => setIsAddAccountOpen(true)} className="py-2 px-3 text-sm">
                    <Plus size={16} /> Nueva
                </Button>
            </div>
            
            <Card className="bg-slate-900 dark:bg-slate-800 text-white mb-6">
                <p className="text-sm opacity-70 mb-1">Saldo Total</p>
                <p className="text-3xl font-bold">${stats.totalBalance.toLocaleString()}</p>
            </Card>

            <div className="grid grid-cols-1 gap-4">
                {accounts.map(acc => {
                     const bankInfo = COLOMBIAN_BANKS.find(b => b.name === acc.bank) || { textColor: 'text-white' };
                     return (
                         <div key={acc.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm" style={{ backgroundColor: acc.color }}>
                                    <Landmark size={20} className={bankInfo.textColor} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{acc.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{acc.bank} • {acc.type === 'SAVINGS' ? 'Ahorros' : acc.type === 'DIGITAL' ? 'Digital' : acc.type === 'CURRENT' ? 'Corriente' : 'Efectivo'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">${acc.balance.toLocaleString()}</p>
                                <button 
                                    onClick={() => { setSelectedAccount(acc); setIsEditAccountOpen(true); }}
                                    className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                            </div>
                         </div>
                     )
                })}
            </div>
            
            <div className="mt-8">
                 <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Movimientos por Cuenta</h3>
                 {/* Here we could list transactions grouped by account, for now simple list */}
                 <div className="space-y-3">
                    {transactions.filter(t => t.accountId).slice(0, 10).map(t => (
                        <div key={t.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div>
                                <p className="text-sm font-medium dark:text-slate-200">{t.description}</p>
                                <p className="text-xs text-slate-400">{accounts.find(a => a.id === t.accountId)?.name}</p>
                            </div>
                            <span className={`text-sm font-bold ${t.type === TransactionType.EXPENSE || t.type === TransactionType.LOAN_GIVEN ? 'text-red-600' : 'text-green-600'}`}>
                                {t.type === TransactionType.EXPENSE || t.type === TransactionType.LOAN_GIVEN ? '-' : '+'}${t.amount.toLocaleString()}
                            </span>
                        </div>
                    ))}
                 </div>
            </div>
          </div>
      )
  };

  const LoanDetailView = () => {
    if (!selectedLoan) return null;
    const contact = contacts.find(c => c.id === selectedLoan.contactId);
    
    // Calculate progress
    const paidAmount = selectedLoan.totalAmountWithInterest - selectedLoan.remainingAmount;
    const progress = (paidAmount / selectedLoan.totalAmountWithInterest) * 100;
    
    // Find history for this loan
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
                {selectedLoan.accountId && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400">Desembolsado desde/hacia:</p>
                        <div className="flex items-center gap-2 mt-1">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accounts.find(a => a.id === selectedLoan.accountId)?.color }}></div>
                             <span className="text-sm font-medium dark:text-slate-300">{accounts.find(a => a.id === selectedLoan.accountId)?.name}</span>
                        </div>
                    </div>
                )}
            </Card>

            {selectedLoan.status === LoanStatus.ACTIVE && (
                <Button onClick={() => setIsAddPaymentOpen(true)} className="w-full mb-6">
                    <Plus size={18} /> Registrar Abono
                </Button>
            )}

            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Historial de Pagos</h3>
            <div className="space-y-3">
                {history.map(t => (
                    <div key={t.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                {t.type === TransactionType.LOAN_GIVEN || t.type === TransactionType.LOAN_TAKEN ? <Wallet size={14}/> : <CheckCircle size={14}/>}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.description}</p>
                                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">${t.amount.toLocaleString()}</span>
                            {t.evidenceUrl && (
                                <span className="text-[10px] text-blue-500 flex items-center gap-1">
                                    <Camera size={10} /> Evidencia
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* View Evidence Modal (Simple implementation) */}
             {selectedLoan.evidenceUrl && (
                <div className="mt-6">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Evidencia del Préstamo</p>
                    <img src={selectedLoan.evidenceUrl} alt="Evidence" className="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                </div>
            )}
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
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <Wallet size={18} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">FinanceGuard</h1>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Configuración"
            >
                <Settings size={20} />
            </button>
            <button 
                onClick={() => setCurrentView(View.CONTACTS)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Directorio"
            >
                <Users size={20} />
            </button>
            <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        {currentView === View.DASHBOARD && <Dashboard />}
        {currentView === View.EXPENSES && <ExpensesView />}
        {currentView === View.LOANS && <LoansView />}
        {currentView === View.LOAN_DETAIL && <LoanDetailView />}
        {currentView === View.CONTACTS && <ContactsList />}
        {currentView === View.ACCOUNTS && <AccountsView />}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex justify-between items-center z-40 safe-area-bottom transition-colors">
        {/* Home */}
        <button onClick={() => setCurrentView(View.DASHBOARD)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.DASHBOARD ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <Home size={24} strokeWidth={currentView === View.DASHBOARD ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Inicio</span>
        </button>
        
        {/* Accounts Tab */}
        <button onClick={() => setCurrentView(View.ACCOUNTS)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.ACCOUNTS ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <Wallet size={24} strokeWidth={currentView === View.ACCOUNTS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Cuentas</span>
        </button>

        {/* Center Action Button */}
        <div className="relative -top-5">
            <button onClick={() => setIsActionMenuOpen(true)} className="bg-brand-600 text-white p-4 rounded-full shadow-lg shadow-brand-200 dark:shadow-brand-900/20 active:scale-95 transition-transform hover:bg-brand-700">
                <Plus size={24} />
            </button>
        </div>

        {/* Expenses Tab */}
        <button onClick={() => setCurrentView(View.EXPENSES)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.EXPENSES ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <CreditCard size={24} strokeWidth={currentView === View.EXPENSES ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Gastos</span>
        </button>

        {/* Loans Tab */}
        <button onClick={() => setCurrentView(View.LOANS)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === View.LOANS ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'text-slate-400 dark:text-slate-500'}`}>
            <DollarSign size={24} strokeWidth={currentView === View.LOANS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Préstamos</span>
        </button>
      </nav>

      {/* --- Modals & Menus --- */}

      <ActionMenu 
        isOpen={isActionMenuOpen} 
        onClose={() => setIsActionMenuOpen(false)} 
        onAddExpense={() => setIsAddExpenseOpen(true)}
        onAddLoan={() => setIsAddLoanOpen(true)}
      />

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Configuración y Datos">
          <div className="space-y-6">
              
              <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Copia de Seguridad</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={handleExportData} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex flex-col items-center gap-2 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                          <Download size={24} />
                          <span className="text-sm font-bold">Exportar</span>
                      </button>
                      
                      <button onClick={handleImportClick} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex flex-col items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                          <Upload size={24} />
                          <span className="text-sm font-bold">Importar</span>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImportData} 
                        accept=".json" 
                        className="hidden" 
                      />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                      Guarda un archivo .json en tu dispositivo para respaldar tu información o moverla a otro equipo.
                  </p>
              </div>

              <div>
                  <h3 className="text-sm font-bold text-red-500 uppercase mb-3">Zona de Peligro</h3>
                  <button onClick={handleClearData} className="w-full p-3 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={20} />
                      <span className="font-bold">Borrar Todos los Datos</span>
                  </button>
              </div>

          </div>
      </Modal>

      {/* Add Account Modal */}
      <Modal isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} title="Nueva Cuenta">
          <form onSubmit={handleAddAccount} className="space-y-4">
              <Select name="bank" label="Banco / Entidad" required>
                  {COLOMBIAN_BANKS.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
              </Select>
              <Input name="name" type="text" label="Nombre de la Cuenta" placeholder="Ej. Ahorros Nómina" required />
              <Select name="type" label="Tipo de Cuenta">
                  <option value="SAVINGS">Ahorros</option>
                  <option value="CURRENT">Corriente</option>
                  <option value="DIGITAL">Billetera Digital</option>
                  <option value="CASH">Efectivo</option>
              </Select>
              <Input name="balance" type="number" step="0.01" label="Saldo Inicial" placeholder="0.00" required />
              <Button type="submit" className="w-full">Guardar Cuenta</Button>
          </form>
      </Modal>

      {/* Edit Account Modal */}
      <Modal isOpen={isEditAccountOpen} onClose={() => { setIsEditAccountOpen(false); setSelectedAccount(null); }} title="Editar Cuenta">
          {selectedAccount && (
              <form onSubmit={handleEditAccount} className="space-y-4">
                  <Select name="bank" label="Banco / Entidad" defaultValue={COLOMBIAN_BANKS.find(b => b.name === selectedAccount.bank)?.id || 'otro'} required>
                      {COLOMBIAN_BANKS.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                  </Select>
                  <Input name="name" type="text" label="Nombre de la Cuenta" defaultValue={selectedAccount.name} required />
                  <Select name="type" label="Tipo de Cuenta" defaultValue={selectedAccount.type}>
                      <option value="SAVINGS">Ahorros</option>
                      <option value="CURRENT">Corriente</option>
                      <option value="DIGITAL">Billetera Digital</option>
                      <option value="CASH">Efectivo</option>
                  </Select>
                  <Input name="balance" type="number" step="0.01" label="Saldo" defaultValue={selectedAccount.balance} required />
                  <Button type="submit" className="w-full">Actualizar Cuenta</Button>
              </form>
          )}
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} title="Registrar Gasto">
        <form onSubmit={handleAddExpense} className="space-y-4">
            <Input name="amount" type="number" step="0.01" label="Monto" placeholder="0.00" required autoFocus />
            <Input name="description" type="text" label="Descripción" placeholder="Ej. Comida, Transporte" required />
            <Select name="account" label="Pagar desde (Cuenta)" required>
                  <option value="">Seleccionar cuenta...</option>
                  {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - ${a.balance.toLocaleString()}</option>
                  ))}
            </Select>
            <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
            
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Evidencia (Opcional)</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer">
                    <input type="file" name="evidence" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <Camera className="mx-auto text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Toca para tomar foto o subir</span>
                </div>
            </div>

            <Button type="submit" className="w-full">Guardar Gasto</Button>
        </form>
      </Modal>

      {/* Add Loan Modal */}
      <Modal isOpen={isAddLoanOpen} onClose={() => setIsAddLoanOpen(false)} title="Nuevo Préstamo">
        <form onSubmit={handleAddLoan} className="space-y-4">
            <Select name="type" label="Tipo de Movimiento">
                <option value="LENT">Prestar (Me deben)</option>
                <option value="BORROWED">Pedir Prestado (Debo)</option>
            </Select>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Persona</label>
                <input 
                    list="contacts-list" 
                    name="contactName"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Escribe el nombre o selecciona..."
                    required
                />
                <datalist id="contacts-list">
                    {contacts.map(c => <option key={c.id} value={c.name} />)}
                </datalist>
            </div>

            <Input name="amount" type="number" step="0.01" label="Monto" placeholder="0.00" required />

            <Select name="account" label="Cuenta (Origen/Destino)" required>
                  <option value="">Seleccionar cuenta...</option>
                  {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - ${a.balance.toLocaleString()}</option>
                  ))}
            </Select>
            
            <div className="grid grid-cols-2 gap-4">
                <Input name="interest" type="number" step="0.1" label="Interés %" placeholder="0" defaultValue="0" />
                <Input name="dueDate" type="date" label="Fecha Límite (Opcional)" />
            </div>

            <Input name="date" type="date" label="Fecha Inicio" defaultValue={new Date().toISOString().split('T')[0]} required />
            <Input name="description" type="text" label="Nota / Motivo" placeholder="Ej. Préstamo personal" />

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pagaré / Evidencia</label>
                <input type="file" name="evidence" accept="image/*" capture="environment" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-900/30 dark:file:text-brand-400 hover:file:bg-brand-100 dark:hover:file:bg-brand-900/50"/>
            </div>

            <Button type="submit" className="w-full">Crear Préstamo</Button>
        </form>
      </Modal>

      {/* Add Contact Modal */}
      <Modal isOpen={isAddContactOpen} onClose={() => setIsAddContactOpen(false)} title="Nuevo Contacto">
        <form onSubmit={handleAddContact} className="space-y-4">
            <Input name="name" type="text" label="Nombre Completo" placeholder="Nombre" required />
            <Input name="relation" type="text" label="Relación" placeholder="Ej. Amigo, Tío, Trabajo" />
            <Input name="phone" type="tel" label="Teléfono" placeholder="Opcional" />
            <Button type="submit" className="w-full">Guardar Contacto</Button>
        </form>
      </Modal>

      {/* Add Payment Modal */}
      <Modal isOpen={isAddPaymentOpen} onClose={() => setIsAddPaymentOpen(false)} title="Registrar Abono">
        <div className="mb-4 bg-brand-50 dark:bg-brand-900/20 p-3 rounded-lg text-brand-800 dark:text-brand-300 text-sm">
            <p>Deuda actual: <strong>${selectedLoan?.remainingAmount.toLocaleString()}</strong></p>
        </div>
        <form onSubmit={handleAddPayment} className="space-y-4">
            <Input name="amount" type="number" step="0.01" max={selectedLoan?.remainingAmount} label="Monto a Abonar" placeholder="0.00" required autoFocus />
            <Select name="account" label="Cuenta (Origen/Destino)" required>
                  <option value="">Seleccionar cuenta...</option>
                  {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - ${a.balance.toLocaleString()}</option>
                  ))}
            </Select>
            <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comprobante</label>
                <input type="file" name="evidence" accept="image/*" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-900/30 dark:file:text-brand-400 hover:file:bg-brand-100 dark:hover:file:bg-brand-900/50"/>
            </div>
            <Button type="submit" className="w-full">Registrar Pago</Button>
        </form>
      </Modal>

    </div>
  );
}