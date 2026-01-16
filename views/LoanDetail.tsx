
import React, { useState } from 'react';
import { ArrowDownLeft, History, Wallet, CheckCircle, Plus } from 'lucide-react';
import { Card, Button, Modal, Input, Select } from '../components/UI.tsx';
import { StorageService } from '../services/storage.ts';
import { NotificationService } from '../services/notifications.ts';
import { LoanStatus } from '../types.ts';

export const LoanDetailView = ({ loan, contacts, transactions, onBack, refresh, remindersEnabled }: any) => {
    const [isAbonoOpen, setIsAbonoOpen] = useState(false);
    
    if (!loan) return null;
    const contact = contacts.find((c: any) => c.id === loan.contactId);
    const history = transactions.filter((t: any) => t.loanId === loan.id).sort((a: any, b: any) => b.date - a.date);

    const handleAbono = (e: React.FormEvent) => {
        e.preventDefault();
        const f = e.target as HTMLFormElement;
        const amount = parseFloat((f.elements.namedItem('amount') as HTMLInputElement).value);
        const accountId = (f.elements.namedItem('account') as HTMLSelectElement).value;

        StorageService.registerLoanPayment(
            loan.id,
            amount,
            Date.now(),
            accountId
        );

        // Si se pagó por completo, cancelar notificación
        const updatedLoan = StorageService.getLoans().find(l => l.id === loan.id);
        if (updatedLoan && updatedLoan.status === LoanStatus.PAID && remindersEnabled) {
            NotificationService.cancelLoanReminder(loan.id);
        }

        setIsAbonoOpen(false);
        refresh();
    };

    return (
        <div className="pb-20 animate-in slide-in-from-right duration-200">
            <button onClick={onBack} className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400"><ArrowDownLeft className="rotate-90" size={20} /> Volver</button>
            <Card className="mb-4">
                <p className="text-sm text-slate-500">Préstamo con</p>
                <h1 className="text-2xl font-bold dark:text-slate-100">{contact?.name}</h1>
                <div className="mt-4 pt-4 border-t dark:border-slate-800">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="dark:text-slate-400">Deuda Restante</span>
                        <span className="font-bold text-brand-600">${loan.remainingAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 transition-all" style={{ width: `${(1 - (loan.remainingAmount / loan.totalAmountWithInterest)) * 100}%` }}></div>
                    </div>
                    {loan.dueDate && (
                        <p className="text-[10px] text-slate-400 mt-2">Vence: {new Date(loan.dueDate).toLocaleDateString()}</p>
                    )}
                </div>
            </Card>

            {loan.status !== LoanStatus.PAID && (
                <Button onClick={() => setIsAbonoOpen(true)} className="w-full mb-6">
                    <Plus size={18} /> Registrar Abono
                </Button>
            )}

            <h3 className="font-bold mb-3 flex items-center gap-2 dark:text-slate-200 text-sm"><History size={14}/> Historial de transacciones</h3>
            <div className="space-y-2">
                {history.map((t: any) => (
                    <div key={t.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border dark:border-slate-800 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                {t.type.includes('PAYMENT') ? <CheckCircle size={14}/> : <Wallet size={14}/>}
                            </div>
                            <div>
                                <p className="text-sm font-medium dark:text-slate-200">{t.description}</p>
                                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className="font-bold text-sm dark:text-slate-100">${t.amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <Modal isOpen={isAbonoOpen} onClose={() => setIsAbonoOpen(false)} title="Registrar Pago / Abono">
                <form onSubmit={handleAbono} className="space-y-4">
                    <Input name="amount" type="number" step="0.01" max={loan.remainingAmount} label="Monto del pago" required autoFocus />
                    <Select name="account" label="¿De dónde sale el dinero?" required>
                        {StorageService.getAccounts().map(a => <option key={a.id} value={a.id}>{a.name} (${a.balance.toLocaleString()})</option>)}
                    </Select>
                    <Button type="submit" variant="success" className="w-full">Confirmar Pago</Button>
                </form>
            </Modal>
        </div>
    );
};
