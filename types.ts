export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  LOAN_GIVEN = 'LOAN_GIVEN', // Presté dinero
  LOAN_TAKEN = 'LOAN_TAKEN', // Me prestaron dinero
  LOAN_PAYMENT = 'LOAN_PAYMENT' // Abono a préstamo
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
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
  relation?: string; // Amigo, Familiar, Trabajo
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: number;
  description: string;
  categoryId?: string;
  evidenceUrl?: string; // Base64 image
  
  // Relacionado con préstamos
  contactId?: string;
  loanId?: string;
  
  // Relacionado con cuentas
  accountId?: string;
}

export interface Loan {
  id: string;
  contactId: string;
  type: 'LENT' | 'BORROWED'; // LENT = Yo presté, BORROWED = Me prestaron
  originalAmount: number;
  interestRate: number; // Porcentaje (0-100)
  totalAmountWithInterest: number;
  remainingAmount: number;
  startDate: number;
  dueDate?: number; // Ahora es opcional
  status: LoanStatus;
  description: string;
  evidenceUrl?: string;
  accountId?: string; // Cuenta de donde salió/entró el dinero original
}

export interface DashboardStats {
  totalExpenses: number;
  totalLoansGiven: number; // Lo que me deben
  totalLoansTaken: number; // Lo que debo
  activeLoansCount: number;
  totalBalance: number; // Nuevo: Saldo total en cuentas
}