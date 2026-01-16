
import { Contact, Loan, Transaction, TransactionType, LoanStatus, DashboardStats, BankAccount } from '../types.ts';

const STORAGE_KEYS = {
  CONTACTS: 'fg_contacts',
  TRANSACTIONS: 'fg_transactions',
  LOANS: 'fg_loans',
  ACCOUNTS: 'fg_accounts',
  SETTINGS: 'fg_settings'
};

const save = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage Save Error:', e);
    // En móviles, esto puede pasar si el disco está lleno
  }
};

const load = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error('LocalStorage Load Error:', e);
    return defaultValue;
  }
};

export const StorageService = {
  getAccounts: (): BankAccount[] => load<BankAccount[]>(STORAGE_KEYS.ACCOUNTS, []),
  
  updateAccountBalance: (accountId: string, amount: number, operation: 'ADD' | 'SUBTRACT') => {
    const accounts = StorageService.getAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index !== -1) {
        accounts[index].balance = operation === 'ADD' 
          ? accounts[index].balance + amount 
          : accounts[index].balance - amount;
        save(STORAGE_KEYS.ACCOUNTS, accounts);
    }
  },

  addAccount: (account: BankAccount): void => {
    const accounts = StorageService.getAccounts();
    save(STORAGE_KEYS.ACCOUNTS, [...accounts, account]);
  },

  getContacts: (): Contact[] => load<Contact[]>(STORAGE_KEYS.CONTACTS, []),
  
  addContact: (contact: Contact): void => {
    const contacts = StorageService.getContacts();
    save(STORAGE_KEYS.CONTACTS, [...contacts, contact]);
  },

  getTransactions: (): Transaction[] => load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []),
  
  addTransaction: (transaction: Transaction): void => {
    const transactions = StorageService.getTransactions();
    save(STORAGE_KEYS.TRANSACTIONS, [transaction, ...transactions]);
    if (transaction.accountId) {
        const op = transaction.type === TransactionType.INCOME ? 'ADD' : 'SUBTRACT';
        StorageService.updateAccountBalance(transaction.accountId, transaction.amount, op);
    }
  },

  getLoans: (): Loan[] => load<Loan[]>(STORAGE_KEYS.LOANS, []),
  
  addLoan: (loan: Loan): void => {
    const loans = StorageService.getLoans();
    save(STORAGE_KEYS.LOANS, [loan, ...loans]);
    
    // Crear transacción asociada al préstamo
    StorageService.addTransaction({
      id: crypto.randomUUID(),
      type: loan.type === 'LENT' ? TransactionType.LOAN_GIVEN : TransactionType.LOAN_TAKEN,
      amount: loan.originalAmount,
      date: loan.startDate,
      description: `Préstamo: ${loan.description || 'Sin descripción'}`,
      contactId: loan.contactId,
      loanId: loan.id,
      accountId: loan.accountId
    });
  },

  registerLoanPayment: (loanId: string, amount: number, date: number, accountId?: string): void => {
    const loans = StorageService.getLoans();
    const idx = loans.findIndex(l => l.id === loanId);
    if (idx === -1) return;

    const loan = loans[idx];
    loan.remainingAmount = Math.max(0, loan.remainingAmount - amount);
    loan.status = loan.remainingAmount <= 0 ? LoanStatus.PAID : LoanStatus.ACTIVE;
    
    save(STORAGE_KEYS.LOANS, loans);

    StorageService.addTransaction({
      id: crypto.randomUUID(),
      type: TransactionType.LOAN_PAYMENT,
      amount: amount,
      date: date,
      description: `Abono préstamo ${loan.type === 'LENT' ? 'de' : 'a'} contacto`,
      contactId: loan.contactId,
      loanId: loan.id,
      accountId
    });
  },

  getStats: (): DashboardStats => {
    const transactions = StorageService.getTransactions();
    const loans = StorageService.getLoans();
    const accounts = StorageService.getAccounts();
    
    return {
      totalExpenses: transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0),
      totalLoansGiven: loans.filter(l => l.type === 'LENT' && l.status !== LoanStatus.PAID).reduce((s, l) => s + l.remainingAmount, 0),
      totalLoansTaken: loans.filter(l => l.type === 'BORROWED' && l.status !== LoanStatus.PAID).reduce((s, l) => s + l.remainingAmount, 0),
      activeLoansCount: loans.filter(l => l.status === LoanStatus.ACTIVE).length,
      totalBalance: accounts.reduce((s, a) => s + a.balance, 0)
    };
  },

  getSettings: () => load(STORAGE_KEYS.SETTINGS, { remindersEnabled: false }),
  saveSettings: (settings: any) => save(STORAGE_KEYS.SETTINGS, settings),

  // Implementation of exportData used in App.tsx to create a backup file
  exportData: (): string => {
    const data = {
      contacts: StorageService.getContacts(),
      transactions: StorageService.getTransactions(),
      loans: StorageService.getLoans(),
      accounts: StorageService.getAccounts(),
      settings: StorageService.getSettings()
    };
    return JSON.stringify(data, null, 2);
  },

  clearAll: () => {
    localStorage.clear();
    location.reload();
  }
};