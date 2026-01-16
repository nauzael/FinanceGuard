
import React, { useState, useEffect, useCallback } from 'react';
import { Home, Wallet, CreditCard, DollarSign, Plus, Settings, Sun, Moon, Camera, Bell, BellOff } from 'lucide-react';
import { StorageService } from './services/storage.ts';
import { NotificationService } from './services/notifications.ts';
import { View, TransactionType, LoanStatus, BankAccount, Contact, Loan, Transaction, DashboardStats } from './types.ts';
import { Modal, ActionMenu, Button, Input, Select, COLOMBIAN_BANKS } from './components/UI.tsx';
import { GoogleGenAI } from "@google/genai";

// Vistas
import { Dashboard } from './views/Dashboard.tsx';
import { ExpensesView } from './views/Expenses.tsx';
import { LoansView } from './views/Loans.tsx';
import { AccountsView } from './views/Accounts.tsx';
import { ContactsList } from './views/Contacts.tsx';
import { LoanDetailView } from './views/LoanDetail.tsx';

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
  const [stats, setStats] = useState<DashboardStats>({ totalExpenses: 0, totalLoansGiven: 0, totalLoansTaken: 0, activeLoansCount: 0, totalBalance: 0, aiInsight: '' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [settings, setSettings] = useState(() => StorageService.getSettings());
  const [isAILoading, setIsAILoading] = useState(false);

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

  const refreshData = useCallback(() => {
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
  }, []);

  const generateAIInsight = async () => {
    if (isAILoading) return;
    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Actúa como un experto asesor financiero personal. Analiza este resumen financiero en pesos colombianos:
      - Saldo total en cuentas: $${stats.totalBalance}
      - Gastos totales registrados: $${stats.totalExpenses}
      - Dinero que me deben (préstamos otorgados): $${stats.totalLoansGiven}
      - Dinero que yo debo (deudas): $${stats.totalLoansTaken}
      - Préstamos activos: ${stats.activeLoansCount}
      
      Dame un consejo financiero corto (máximo 2 oraciones), directo y accionable en español. Sé motivador pero realista. No uses formato markdown especial, solo texto plano.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || "Sigue controlando tus gastos para mantener una salud financiera óptima.";
      StorageService.saveAIInsight(text);
      setStats(prev => ({ ...prev, aiInsight: text }));
    } catch (error) {
      console.error("Error generating AI insight:", error);
    } finally {
      setIsAILoading(false);
    }
  };

  useEffect(() => { 
    refreshData();
    if (settings.remindersEnabled) {
      NotificationService.requestPermissions();
    }
  }, [refreshData, settings.remindersEnabled]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleReminders = async () => {
    const newVal = !settings.remindersEnabled;
    if (newVal) {
      const granted = await NotificationService.requestPermissions();
      if (!granted) {
        alert('Debes permitir las notificaciones en los ajustes de tu teléfono.');
        return;
      }
    }
    const newSettings = { ...settings, remindersEnabled: newVal };
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const contactName = (form.elements.namedItem('contactName') as HTMLInputElement).value;
    
    let contact = contacts.find(c => c.name.toLowerCase() === contactName.toLowerCase());
    if (!contact) {
      contact = { id: crypto.randomUUID(), name: contactName, relation: 'Contacto', createdAt: Date.now() };
      StorageService.addContact(contact);
    }

    const newLoan: Loan = {
      id: crypto.randomUUID(),
      contactId: contact.id,
      type: (form.elements.namedItem('type') as HTMLSelectElement).value as any,
      originalAmount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value),
      interestRate: parseFloat((form.elements.namedItem('interest') as HTMLInputElement).value) || 0,
      totalAmountWithInterest: 0,
      remainingAmount: 0,
      startDate: new Date((form.elements.namedItem('date') as HTMLInputElement).value).getTime(),
      dueDate: (form.elements.namedItem('dueDate') as HTMLInputElement).value ? new Date((form.elements.namedItem('dueDate') as HTMLInputElement).value).getTime() : undefined,
      status: LoanStatus.ACTIVE,
      description: (form.elements.namedItem('description') as HTMLInputElement).value,
      accountId: (form.elements.namedItem('account') as HTMLSelectElement).value,
      evidenceUrl: formImagePreview || undefined
    };

    newLoan.totalAmountWithInterest = newLoan.originalAmount * (1 + (newLoan.interestRate / 100));
    newLoan.remainingAmount = newLoan.totalAmountWithInterest;

    StorageService.addLoan(newLoan);
    
    if (settings.remindersEnabled && newLoan.dueDate) {
      NotificationService.scheduleLoanReminder(newLoan, contact.name);
    }

    setIsAddLoanOpen(false);
    setFormImagePreview(null);
    refreshData();
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

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    StorageService.addTransaction({
        id: crypto.randomUUID(),
        type: TransactionType.EXPENSE,
        amount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value),
        description: (form.elements.namedItem('description') as HTMLInputElement).value,
        date: new Date((form.elements.namedItem('date') as HTMLInputElement).value).getTime(),
        accountId: (form.elements.namedItem('account') as HTMLSelectElement).value,
        evidenceUrl: formImagePreview || undefined
    });
    setIsAddExpenseOpen(false);
    setFormImagePreview(null);
    refreshData();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white"><Wallet size={18} /></div>
            <h1 className="font-bold text-xl text-slate-900 dark:text-white">FinanceGuard</h1>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"><Settings size={20} /></button>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {currentView === View.DASHBOARD && (
          <Dashboard 
            stats={stats} 
            accounts={accounts} 
            recentTransactions={transactions.slice(0, 10)} 
            loans={loans} 
            contacts={contacts} 
            onAddAccount={() => setIsAddAccountOpen(true)} 
            onSetView={setCurrentView} 
            onSelectLoan={(l:any) => { setSelectedLoan(l); setCurrentView(View.LOAN_DETAIL); }}
            onRefreshAI={generateAIInsight}
            isAILoading={isAILoading}
          />
        )}
        {currentView === View.EXPENSES && <ExpensesView transactions={transactions} onAddExpense={() => setIsAddExpenseOpen(true)} />}
        {currentView === View.LOANS && <LoansView loans={loans} contacts={contacts} onSelectLoan={(l: any) => { setSelectedLoan(l); setCurrentView(View.LOAN_DETAIL); }} onAddLoan={() => setIsAddLoanOpen(true)} />}
        {currentView === View.LOAN_DETAIL && <LoanDetailView loan={selectedLoan} contacts={contacts} transactions={transactions} onBack={() => setCurrentView(View.LOANS)} refresh={refreshData} remindersEnabled={settings.remindersEnabled} />}
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

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Configuración">
          <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                      {settings.remindersEnabled ? <Bell size={20} className="text-brand-600" /> : <BellOff size={20} className="text-slate-400" />}
                      <div>
                        <p className="font-bold text-sm">Recordatorios de Pago</p>
                        <p className="text-xs opacity-70">Notificaciones el día del vencimiento</p>
                      </div>
                   </div>
                   <button onClick={handleToggleReminders} className={`w-12 h-6 rounded-full transition-colors relative ${settings.remindersEnabled ? 'bg-brand-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.remindersEnabled ? 'left-7' : 'left-1'}`}></div>
                   </button>
                </div>
              </div>
              
              <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase px-1">Datos</p>
                  <Button variant="secondary" onClick={() => {
                    const data = StorageService.exportData();
                    const blob = new Blob([data], {type: 'application/json'});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'financeguard_backup.json'; a.click();
                  }} className="w-full justify-start">Exportar Backup</Button>
                  <Button variant="danger" onClick={() => { if(confirm('¿Borrar todo?')) { StorageService.clearAll(); location.reload(); }}} className="w-full justify-start">Borrar todos los datos</Button>
              </div>
          </div>
      </Modal>

      <Modal isOpen={isAddIncomeOpen} onClose={() => setIsAddIncomeOpen(false)} title="Registrar Ingreso">
          <form onSubmit={handleAddIncome} className="space-y-4">
              <Input name="amount" type="number" step="0.01" label="Monto" required />
              <Input name="description" label="Descripción" required />
              <Select name="account" label="Cuenta" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select>
              <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
              <Button type="submit" variant="success" className="w-full">Guardar</Button>
          </form>
      </Modal>

      <Modal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} title="Registrar Gasto">
          <form onSubmit={handleAddExpense} className="space-y-4">
              <Input name="amount" type="number" step="0.01" label="Monto" required />
              <Input name="description" label="Descripción" required />
              <Select name="account" label="Cuenta" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select>
              <Input name="date" type="date" label="Fecha" defaultValue={new Date().toISOString().split('T')[0]} required />
              <div>
                <label className="block text-sm font-medium mb-1">Evidencia (Foto)</label>
                <div className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                   <input type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                   {formImagePreview ? <img src={formImagePreview} className="h-20 mx-auto rounded" /> : <Camera className="mx-auto opacity-40" />}
                </div>
              </div>
              <Button type="submit" className="w-full">Guardar Gasto</Button>
          </form>
      </Modal>

      <Modal isOpen={isAddLoanOpen} onClose={() => setIsAddLoanOpen(false)} title="Nuevo Préstamo">
          <form onSubmit={handleAddLoan} className="space-y-4">
              <Select name="type" label="Tipo"><option value="LENT">Prestar dinero</option><option value="BORROWED">Pedir prestado</option></Select>
              <Input name="contactName" label="¿Con quién?" placeholder="Nombre de la persona" required />
              <Input name="amount" type="number" step="0.01" label="Monto" required />
              <Input name="interest" type="number" step="0.1" label="Interés % (Opcional)" defaultValue="0" />
              <Input name="date" type="date" label="Fecha Inicio" defaultValue={new Date().toISOString().split('T')[0]} required />
              <Input name="dueDate" type="date" label="Fecha de Pago (Para recordatorio)" />
              <Select name="account" label="Cuenta de origen/destino" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select>
              <Input name="description" label="Nota" />
              <Button type="submit" className="w-full">Crear Préstamo</Button>
          </form>
      </Modal>

      <Modal isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} title="Nueva Cuenta">
          <form onSubmit={(e) => {
              e.preventDefault();
              const f = e.target as HTMLFormElement;
              const bank = (f.elements.namedItem('bank') as HTMLSelectElement).value;
              const bankInfo = COLOMBIAN_BANKS.find(b => b.id === bank) || COLOMBIAN_BANKS[0];
              StorageService.addAccount({
                  id: crypto.randomUUID(),
                  name: (f.elements.namedItem('name') as HTMLInputElement).value,
                  bank: bankInfo.name,
                  type: (f.elements.namedItem('type') as HTMLSelectElement).value as any,
                  balance: parseFloat((f.elements.namedItem('balance') as HTMLInputElement).value),
                  color: bankInfo.color
              });
              setIsAddAccountOpen(false);
              refreshData();
          }} className="space-y-4">
              <Select name="bank" label="Banco">{COLOMBIAN_BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
              <Input name="name" label="Nombre de la cuenta" placeholder="Ej: Mi Nómina" required />
              <Select name="type" label="Tipo"><option value="SAVINGS">Ahorros</option><option value="DIGITAL">Billetera Digital</option><option value="CURRENT">Corriente</option></Select>
              <Input name="balance" type="number" step="0.01" label="Saldo Inicial" required />
              <Button type="submit" className="w-full">Crear Cuenta</Button>
          </form>
      </Modal>
    </div>
  );
}