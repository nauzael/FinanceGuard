
import { Contact, Loan, Transaction, TransactionType, LoanStatus, DashboardStats, BankAccount } from '../types.ts';

const STORAGE_KEYS = {
  CONTACTS: 'fg_contacts',
  TRANSACTIONS: 'fg_transactions',
  LOANS: 'fg_loans',
  ACCOUNTS: 'fg_accounts',
};

// Helpers
const save = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
    alert('Espacio de almacenamiento lleno o error al guardar.');
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

// Internal helper to update account balance
const updateAccountBalance = (accountId: string, amount: number, operation: 'ADD' | 'SUBTRACT') => {
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
};

// API
export const StorageService = {
  // Accounts
  getAccounts: (): BankAccount[] => load<BankAccount[]>(STORAGE_KEYS.ACCOUNTS, []),

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

  // Contacts
  getContacts: (): Contact[] => load<Contact[]>(STORAGE_KEYS.CONTACTS, []),
  
  addContact: (contact: Contact): void => {
    const contacts = StorageService.getContacts();
    save(STORAGE_KEYS.CONTACTS, [...contacts, contact]);
  },

  deleteContact: (id: string): void => {
    const contacts = StorageService.getContacts().filter(c => c.id !== id);
    save(STORAGE_KEYS.CONTACTS, contacts);
  },

  // Transactions
  getTransactions: (): Transaction[] => load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []),

  addTransaction: (transaction: Transaction): void => {
    const transactions = StorageService.getTransactions();
    save(STORAGE_KEYS.TRANSACTIONS, [transaction, ...transactions]);

    // Update Account Balance
    if (transaction.accountId) {
        if (transaction.type === TransactionType.EXPENSE) {
            updateAccountBalance(transaction.accountId, transaction.amount, 'SUBTRACT');
        } else if (transaction.type === TransactionType.INCOME) {
            updateAccountBalance(transaction.accountId, transaction.amount, 'ADD');
        }
    }
  },

  // Loans
  getLoans: (): Loan[] => load<Loan[]>(STORAGE_KEYS.LOANS, []),

  addLoan: (loan: Loan): void => {
    const loans = StorageService.getLoans();
    save(STORAGE_KEYS.LOANS, [loan, ...loans]);
    
    // Al crear un préstamo, también creamos una transacción inicial
    const transactionType = loan.type === 'LENT' ? TransactionType.LOAN_GIVEN : TransactionType.LOAN_TAKEN;
    
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: transactionType,
      amount: loan.originalAmount,
      date: loan.startDate,
      description: `Préstamo creado: ${loan.description}`,
      contactId: loan.contactId,
      loanId: loan.id,
      evidenceUrl: loan.evidenceUrl,
      accountId: loan.accountId
    };
    
    // Save transaction directly to avoid double balance update if we used addTransaction logic blindly
    const transactions = StorageService.getTransactions();
    save(STORAGE_KEYS.TRANSACTIONS, [transaction, ...transactions]);

    // Update Balance
    if (loan.accountId) {
        if (loan.type === 'LENT') {
            // Yo presté -> Salió dinero de mi cuenta
            updateAccountBalance(loan.accountId, loan.originalAmount, 'SUBTRACT');
        } else {
            // Me prestaron -> Entró dinero a mi cuenta
            updateAccountBalance(loan.accountId, loan.originalAmount, 'ADD');
        }
    }
  },

  registerLoanPayment: (loanId: string, amount: number, date: number, accountId?: string, evidenceUrl?: string, paymentType: string = 'CAPITAL_AND_INTEREST'): void => {
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

    // Mapear el tipo de pago a una descripción legible
    let typeLabel = '';
    switch(paymentType) {
        case 'CAPITAL': typeLabel = 'Capital'; break;
        case 'INTEREST': typeLabel = 'Intereses'; break;
        case 'CAPITAL_AND_INTEREST': default: typeLabel = 'Capital e Intereses'; break;
    }

    // Registrar transacción del pago
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: TransactionType.LOAN_PAYMENT,
      amount: amount,
      date: date,
      description: `Abono a ${typeLabel} (${loan.type === 'LENT' ? 'Entrada' : 'Salida'})`,
      contactId: loan.contactId,
      loanId: loan.id,
      evidenceUrl,
      accountId
    };
    
    const transactions = StorageService.getTransactions();
    save(STORAGE_KEYS.TRANSACTIONS, [transaction, ...transactions]);

    // Update Balance
    if (accountId) {
        if (loan.type === 'LENT') {
            // Era un préstamo que YO hice. Si hay un abono, es dinero que ENTRA (Me pagan).
            updateAccountBalance(accountId, amount, 'ADD');
        } else {
            // Era un préstamo que me hicieron. Si hay un abono, es dinero que SALE (Yo pago).
            updateAccountBalance(accountId, amount, 'SUBTRACT');
        }
    }
  },

  getStats: (): DashboardStats => {
    const transactions = StorageService.getTransactions();
    const loans = StorageService.getLoans();
    const accounts = StorageService.getAccounts();

    // Sumar gastos
    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcular deuda total (lo que yo debo)
    const totalLoansTaken = loans
      .filter(l => l.type === 'BORROWED' && l.status !== LoanStatus.PAID)
      .reduce((sum, l) => sum + l.remainingAmount, 0);

    // Calcular prestado total (lo que me deben)
    const totalLoansGiven = loans
      .filter(l => l.type === 'LENT' && l.status !== LoanStatus.PAID)
      .reduce((sum, l) => sum + l.remainingAmount, 0);
    
    const activeLoansCount = loans.filter(l => l.status === LoanStatus.ACTIVE || l.status === LoanStatus.OVERDUE).length;

    // Total Balance
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return {
      totalExpenses,
      totalLoansGiven,
      totalLoansTaken,
      activeLoansCount,
      totalBalance
    };
  },

  // Backup & Restore
  exportData: (): string => {
    const data = {
      contacts: load(STORAGE_KEYS.CONTACTS, []),
      transactions: load(STORAGE_KEYS.TRANSACTIONS, []),
      loans: load(STORAGE_KEYS.LOANS, []),
      accounts: load(STORAGE_KEYS.ACCOUNTS, []),
      version: 1,
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importData: (json: string): boolean => {
      try {
          const data = JSON.parse(json);
          // Basic validation
          if (!data.version) return false;
          
          if (data.contacts) save(STORAGE_KEYS.CONTACTS, data.contacts);
          if (data.transactions) save(STORAGE_KEYS.TRANSACTIONS, data.transactions);
          if (data.loans) save(STORAGE_KEYS.LOANS, data.loans);
          if (data.accounts) save(STORAGE_KEYS.ACCOUNTS, data.accounts);
          
          return true;
      } catch(e) {
          console.error(e);
          return false;
      }
  },
  
  clearAll: () => {
      localStorage.removeItem(STORAGE_KEYS.CONTACTS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.LOANS);
      localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
  }
};
