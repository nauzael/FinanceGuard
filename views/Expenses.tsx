
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../components/UI.tsx';
import { TransactionType } from '../types.ts';

export const ExpensesView = ({ transactions, onAddExpense }: any) => {
    const expenses = transactions.filter((t: any) => t.type === TransactionType.EXPENSE).sort((a: any, b: any) => b.date - a.date);
    return (
        <div className="pb-20 animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Mis Gastos</h2>
                <Button variant="secondary" onClick={onAddExpense} className="py-2 px-3 text-sm"><Plus size={16} /> Nuevo</Button>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
                {expenses.length === 0 ? <div className="p-8 text-center text-slate-400">Sin gastos</div> : 
                 expenses.map((t: any) => (
                    <div key={t.id} className="p-3 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-50 text-red-500"><Minus size={14}/></div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.description}</p>
                                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className="text-sm font-bold">${t.amount.toLocaleString()}</span>
                    </div>
                 ))
                }
            </div>
        </div>
    );
};
