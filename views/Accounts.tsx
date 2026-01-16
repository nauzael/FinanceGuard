
import React from 'react';
import { Plus, Landmark, ChevronRight, Wallet } from 'lucide-react';
import { Card, Button, COLOMBIAN_BANKS } from '../components/UI.tsx';

export const AccountsView = ({ accounts, onAddAccount }: any) => {
    const bankAccounts = accounts.filter((a: any) => a.type !== 'CASH');
    const total = bankAccounts.reduce((sum: number, a: any) => sum + a.balance, 0);

    return (
        <div className="pb-20 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Mis Cuentas</h2>
                <Button variant="secondary" onClick={onAddAccount} className="py-2 px-3 text-sm"><Plus size={16} /> Nueva</Button>
            </div>
            <Card className="bg-slate-900 text-white mb-6"><p className="text-sm opacity-70 mb-1">Saldo Total</p><p className="text-3xl font-bold">${total.toLocaleString()}</p></Card>
            <div className="space-y-4">
                {bankAccounts.map((acc: any) => {
                     const bankInfo = COLOMBIAN_BANKS.find(b => b.name === acc.bank) || { textColor: 'text-white' };
                     return (
                         <div key={acc.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: acc.color }}>
                                    {acc.type === 'CASH' ? <Wallet size={20} /> : <Landmark size={20} />}
                                </div>
                                <div><p className="font-bold">{acc.name}</p><p className="text-sm text-slate-500">{acc.bank}</p></div>
                            </div>
                            <p className="font-bold text-lg">${acc.balance.toLocaleString()}</p>
                         </div>
                     )
                })}
            </div>
        </div>
    );
};
