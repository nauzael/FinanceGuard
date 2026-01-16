
import React, { useState, useEffect, useRef } from 'react';
import { Home, Wallet, CreditCard, DollarSign, Plus, Settings, Sun, Moon, X, Camera } from 'lucide-react';
import { StorageService } from './services/storage.ts';
import { View, TransactionType, LoanStatus, BankAccount, Contact, Loan, Transaction, DashboardStats } from './types.ts';
import { Modal, ActionMenu, Button, Input, Select, COLOMBIAN_BANKS } from './components/UI.tsx';

// Vistas
import { Dashboard } from './views/Dashboard.tsx';
import { ExpensesView } from './views/Expenses.tsx';
import { LoansView } from './views/Loans.tsx';
import { AccountsView } from './views/Accounts.tsx';
import { ContactsList } from './views/Contacts.tsx';
import { LoanDetailView } from './views/LoanDetail.tsx';

// Polyfill randomUUID
if (!crypto.randomUUID) {
  (crypto as any).randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [stats, setStats] = useState<DashboardStats>({ totalExpenses: 0, totalLoansGiven: 0, totalLoansTaken: 0, activeLoansCount: 0, totalBalance: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Modal states
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

  const refreshData = () => {
    setTransactions(StorageService.getTransactions());
    setLoans(StorageService.getLoans());
    setContacts(StorageService.getContacts());
    const accs = StorageService.getAccounts();
    if (accs.length === 0) {
        const cash: BankAccount = { id: 'default-cash', name: 'Mi Efectivo', bank: 'Efectivo', type: 'CASH', balance: 0, color: '#22c55e' };
        StorageService.addAccount(cash);
        setAccounts([cash]);
    } else {
        setAccounts(accs);
    }
    setStats(StorageService.getStats());
  };

  useEffect(() => { refreshData(); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    StorageService.addTransaction({
        id: crypto.randomUUID(),
        type: TransactionType.INCOME,
        amount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value),
        description: (form.elements.namedItem('description') as HTMLInputElement).value,
        date: new Date((form.elements.namedItem('date') as HTMLInputElement).value).getTime(),
        accountId: (form.elements.namedItem('account') as HTMLSelectElement).value
    });
    setIsAddIncomeOpen(false);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white"><Wallet size={18} /></div>
            <h1 className="font-bold text-xl text-slate-900 dark:text-white">FinanceGuard</h1>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"><Settings size={20} /></button>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {currentView === View.DASHBOARD && <Dashboard stats={stats} accounts={accounts} recentTransactions={transactions.slice(0, 10)} onAddAccount={() => setIsAddAccountOpen(true)} onSetView={setCurrentView} />}
        {currentView === View.EXPENSES && <ExpensesView transactions={transactions} onAddExpense={() => setIsAddExpenseOpen(true)} />}
        {currentView === View.LOANS && <LoansView loans={loans} contacts={contacts} onSelectLoan={(l: any) => { setSelectedLoan(l); setCurrentView(View.LOAN_DETAIL); }} onAddLoan={() => setIsAddLoanOpen(true)} />}
        {currentView === View.LOAN_DETAIL && <LoanDetailView loan={selectedLoan} contacts={contacts} transactions={transactions} onBack={() => setCurrentView(View.LOANS)} refresh={refreshData} />}
        {currentView === View.ACCOUNTS && <AccountsView accounts={accounts} onAddAccount={() => setIsAddAccountOpen(true)} />}
        {currentView === View.CONTACTS && <ContactsList contacts={contacts} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex justify-between items-center z-40 safe-area-bottom">
        <button onClick={() => setCurrentView(View.DASHBOARD)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.DASHBOARD ? 'text-brand-600' : 'text-slate-400'}`}><Home size={24} /><span className="text-[10px]">Inicio</span></button>
        <button onClick={() => setCurrentView(View.ACCOUNTS)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.ACCOUNTS ? 'text-brand-600' : 'text-slate-400'}`}><Wallet size={24} /><span className="text-[10px]">Cuentas</span></button>
        <div className="relative -top-5"><button onClick={() => setIsActionMenuOpen(true)} className="bg-brand-600 text-white p-4 rounded-full shadow-lg"><Plus size={24} /></button></div>
        <button onClick={() => setCurrentView(View.EXPENSES)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.EXPENSES ? 'text-brand-600' : 'text-slate-400'}`}><CreditCard size={24} /><span className="text-[10px]">Gastos</span></button>
        <button onClick={() => setCurrentView(View.LOANS)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.LOANS ? 'text-brand-600' : 'text-slate-400'}`}><DollarSign size={24} /><span className="text-[10px]">Préstamos</span></button>
      </nav>

      <ActionMenu isOpen={isActionMenuOpen} onClose={() => setIsActionMenuOpen(false)} onAddIncome={() => setIsAddIncomeOpen(true)} onAddExpense={() => setIsAddExpenseOpen(true)} onAddLoan={() => setIsAddLoanOpen(true)} />

      <Modal isOpen={isAddIncomeOpen} onClose={() => setIsAddIncomeOpen(false)} title="Registrar Ingreso">
          <form onSubmit={handleAddIncome} className="space-y-4">
              <Input name="amount" type="number" step="0.01" label="Monto" required />
              <Input name="description" label="Descripción" required />
              <Select name="account" label="Cuenta" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select>
              <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
              <Button type="submit" variant="success" className="w-full">Guardar</Button>
          </form>
      </Modal>
    </div>
  );
}
