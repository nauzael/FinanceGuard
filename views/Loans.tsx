
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI.tsx';
import { LoanStatus } from '../types.ts';

export const LoansView = ({ loans, contacts, onSelectLoan, onAddLoan }: any) => {
    const [filter, setFilter] = useState('ALL');
    const filtered = loans.filter((l: any) => filter === 'ALL' || l.type === filter);

    return (
        <div className="pb-20 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Préstamos</h2>
                <Button variant="secondary" onClick={onAddLoan} className="py-2 px-3 text-sm"><Plus size={16} /> Nuevo</Button>
            </div>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4">
                {['ALL', 'LENT', 'BORROWED'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-1.5 text-xs font-medium rounded-md ${filter === f ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
                        {f === 'ALL' ? 'Todos' : f === 'LENT' ? 'Me Deben' : 'Debo'}
                    </button>
                ))}
            </div>
            <div className="space-y-3">
                {filtered.map((loan: any) => {
                    const contact = contacts.find((c: any) => c.id === loan.contactId);
                    return (
                        <div key={loan.id} onClick={() => onSelectLoan(loan)} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold">{contact?.name.charAt(0)}</div>
                                <div><p className="font-semibold text-sm">{contact?.name}</p><p className="text-xs text-slate-500">Restante: ${loan.remainingAmount.toLocaleString()}</p></div>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded ${loan.status === LoanStatus.PAID ? 'bg-slate-100' : 'bg-brand-50 text-brand-600'}`}>
                                {loan.status === LoanStatus.PAID ? 'Pagado' : 'Activo'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
