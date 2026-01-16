import { Contact, Loan, Transaction, TransactionType, LoanStatus, DashboardStats, BankAccount } from '../types.ts';

const STORAGE_KEYS = {
  CONTACTS: 'fg_contacts',
  TRANSACTIONS: 'fg_transactions',
  LOANS: 'fg_loans',
  ACCOUNTS: 'fg_accounts',
  SETTINGS: 'fg_settings'
};

// Helpers privados
const save = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

const load = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error loading from localStorage', e);
    return defaultValue;
  }
};

export const StorageService = {
  getAccounts: (): BankAccount[] => load<BankAccount[]>(STORAGE_KEYS.ACCOUNTS, []),
  
  updateAccountBalance: (accountId: string, amount: number, operation: 'ADD' | 'SUBTRACT') => {
    const accounts = StorageService.getAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index !== -1) {
        if (operation === 'ADD') {
            accounts[index].balance += amount;
        } else {
            accounts[index].balance -= amount;
        }
        save(STORAGE_KEYS.ACCOUNTS, accounts);
    }
  },

  addAccount: (account: BankAccount): void => {
    const accounts = StorageService.getAccounts();
    save(STORAGE_KEYS.ACCOUNTS, [...accounts, account]);
  },

  updateAccount: (account: BankAccount): void => {
      const accounts = StorageService.getAccounts();
      const index = accounts.findIndex(a => a.id === account.id);
      if (index !== -1) {
          accounts[index] = account;
          save(STORAGE_KEYS.ACCOUNTS, accounts);
      }
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
        if (transaction.type === TransactionType.EXPENSE) {
            StorageService.updateAccountBalance(transaction.accountId, transaction.amount, 'SUBTRACT');
        } else if (transaction.type === TransactionType.INCOME) {
            StorageService.updateAccountBalance(transaction.accountId, transaction.amount, 'ADD');
        }
    }
  },

  getLoans: (): Loan[] => load<Loan[]>(STORAGE_KEYS.LOANS, []),
  
  addLoan: (loan: Loan): void => {
    const loans = StorageService.getLoans();
    save(STORAGE_KEYS.LOANS, [loan, ...loans]);
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: loan.type === 'LENT' ? TransactionType.LOAN_GIVEN : TransactionType.LOAN_TAKEN,
      amount: loan.originalAmount,
      date: loan.startDate,
      description: `Préstamo creado: ${loan.description}`,
      contactId: loan.contactId,
      loanId: loan.id,
      evidenceUrl: loan.evidenceUrl,
      accountId: loan.accountId
    };
    StorageService.addTransaction(transaction);
  },

  registerLoanPayment: (loanId: string, amount: number, date: number, accountId?: string, evidenceUrl?: string): void => {
    const loans = StorageService.getLoans();
    const loanIndex = loans.findIndex(l => l.id === loanId);
    if (loanIndex === -1) return;
    const loan = loans[loanIndex];
    const newRemaining = Math.max(0, loan.remainingAmount - amount);
    const updatedLoan: Loan = {
      ...loan,
      remainingAmount: newRemaining,
      status: newRemaining <= 0 ? LoanStatus.PAID : LoanStatus.ACTIVE
    };
    loans[loanIndex] = updatedLoan;
    save(STORAGE_KEYS.LOANS, loans);
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: TransactionType.LOAN_PAYMENT,
      amount: amount,
      date: date,
      description: `Abono (${loan.type === 'LENT' ? 'Me pagan' : 'Yo pago'})`,
      contactId: loan.contactId,
      loanId: loan.id,
      evidenceUrl,
      accountId
    };
    const transactions = StorageService.getTransactions();
    save(STORAGE_KEYS.TRANSACTIONS, [transaction, ...transactions]);
    if (accountId) {
        if (loan.type === 'LENT') StorageService.updateAccountBalance(accountId, amount, 'ADD');
        else StorageService.updateAccountBalance(accountId, amount, 'SUBTRACT');
    }
  },

  getStats: (): DashboardStats => {
    const transactions = StorageService.getTransactions();
    const loans = StorageService.getLoans();
    const accounts = StorageService.getAccounts();
    
    const totalExpenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const totalLoansTaken = loans.filter(l => l.type === 'BORROWED' && l.status !== LoanStatus.PAID).reduce((sum, l) => sum + l.remainingAmount, 0);
    const totalLoansGiven = loans.filter(l => l.type === 'LENT' && l.status !== LoanStatus.PAID).reduce((sum, l) => sum + l.remainingAmount, 0);
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    
    return { totalExpenses, totalLoansGiven, totalLoansTaken, activeLoansCount: loans.filter(l => l.status === LoanStatus.ACTIVE).length, totalBalance };
  },

  getSettings: () => load(STORAGE_KEYS.SETTINGS, { remindersEnabled: false }),
  saveSettings: (settings: any) => save(STORAGE_KEYS.SETTINGS, settings),
  
  exportData: (): string => {
    return JSON.stringify({
      contacts: load(STORAGE_KEYS.CONTACTS, []),
      transactions: load(STORAGE_KEYS.TRANSACTIONS, []),
      loans: load(STORAGE_KEYS.LOANS, []),
      accounts: load(STORAGE_KEYS.ACCOUNTS, []),
      version: 1,
      timestamp: new Date().toISOString()
    }, null, 2);
  },

  importData: (json: string): boolean => {
      try {
          const data = JSON.parse(json);
          if (!data.version) return false;
          if (data.contacts) save(STORAGE_KEYS.CONTACTS, data.contacts);
          if (data.transactions) save(STORAGE_KEYS.TRANSACTIONS, data.transactions);
          if (data.loans) save(STORAGE_KEYS.LOANS, data.loans);
          if (data.accounts) save(STORAGE_KEYS.ACCOUNTS, data.accounts);
          return true;
      } catch(e) { return false; }
  },

  clearAll: () => {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};