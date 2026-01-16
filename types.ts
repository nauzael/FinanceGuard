
export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  LOAN_GIVEN = 'LOAN_GIVEN',
  LOAN_TAKEN = 'LOAN_TAKEN',
  LOAN_PAYMENT = 'LOAN_PAYMENT'
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

export enum View {
  DASHBOARD,
  EXPENSES,
  LOANS,
  CONTACTS,
  LOAN_DETAIL,
  ACCOUNTS
}

export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  type: 'SAVINGS' | 'CURRENT' | 'DIGITAL' | 'CASH';
  balance: number;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  relation?: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: number;
  description: string;
  categoryId?: string;
  evidenceUrl?: string;
  contactId?: string;
  loanId?: string;
  accountId?: string;
}

export interface Loan {
  id: string;
  contactId: string;
  type: 'LENT' | 'BORROWED';
  originalAmount: number;
  interestRate: number;
  totalAmountWithInterest: number;
  remainingAmount: number;
  startDate: number;
  dueDate?: number;
  status: LoanStatus;
  description: string;
  evidenceUrl?: string;
  accountId?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  totalLoansGiven: number;
  totalLoansTaken: number;
  activeLoansCount: number;
  totalBalance: number;
}
