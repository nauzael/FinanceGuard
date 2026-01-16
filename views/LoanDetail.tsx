
import React from 'react';
import { ArrowDownLeft, History, Wallet, CheckCircle } from 'lucide-react';
import { Card } from '../components/UI.tsx';

export const LoanDetailView = ({ loan, contacts, transactions, onBack }: any) => {
    if (!loan) return null;
    const contact = contacts.find((c: any) => c.id === loan.contactId);
    const history = transactions.filter((t: any) => t.loanId === loan.id).sort((a: any, b: any) => b.date - a.date);

    return (
        <div className="pb-20 animate-in slide-in-from-right duration-200">
            <button onClick={onBack} className="flex items-center gap-2 mb-4 text-slate-600"><ArrowDownLeft className="rotate-90" size={20} /> Volver</button>
            <Card className="mb-4">
                <p className="text-sm text-slate-500">Préstamo con</p>
                <h1 className="text-2xl font-bold">{contact?.name}</h1>
                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm mb-1"><span>Deuda Restante</span><span className="font-bold text-brand-600">${loan.remainingAmount.toLocaleString()}</span></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${(1 - (loan.remainingAmount / loan.totalAmountWithInterest)) * 100}%` }}></div>
                    </div>
                </div>
            </Card>
            <h3 className="font-bold mb-3 flex items-center gap-2"><History size={14}/> Historial</h3>
            <div className="space-y-2">
                {history.map((t: any) => (
                    <div key={t.id} className="bg-white p-3 rounded-lg border flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">{t.type.includes('PAYMENT') ? <CheckCircle size={14}/> : <Wallet size={14}/>}</div>
                            <div><p className="text-sm font-medium">{t.description}</p><p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p></div>
                        </div>
                        <span className="font-bold text-sm">${t.amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
