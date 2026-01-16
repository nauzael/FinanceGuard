
import React from 'react';
import { Landmark, Plus, Wallet, ArrowUpRight, ArrowDownLeft, AlertCircle, History, Minus, TrendingUp, DollarSign, Image as ImageIcon, Eye } from 'lucide-react';
import { Card, COLOMBIAN_BANKS } from '../components/UI.tsx';
import { TransactionType, View } from '../types.ts';

export const Dashboard = ({ stats, accounts, contacts, recentTransactions, onAddAccount, onEditAccount, onSelectLoan, onSetView, onOpenImageView }: any) => {
    const bankAccounts = accounts.filter((a: any) => a.type !== 'CASH');
    const totalInBanks = bankAccounts.reduce((sum: number, a: any) => sum + a.balance, 0);

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-300">
          <div>
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Landmark size={16} className="text-brand-500" /> Mis Cuentas
                </h3>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">${totalInBanks.toLocaleString()}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <button onClick={onAddAccount} className="min-w-[100px] h-[100px] flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Plus size={24} /> <span className="text-xs font-medium">Agregar</span>
                </button>
                {bankAccounts.map((acc: any) => {
                    const bankInfo = COLOMBIAN_BANKS.find(b => b.name === acc.bank) || { textColor: 'text-white' };
                    return (
                        <div key={acc.id} onClick={() => onEditAccount(acc)} className="min-w-[160px] p-4 rounded-xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden cursor-pointer active:scale-95 transition-transform" style={{ backgroundColor: acc.color }}>
                            <div className={`absolute top-0 right-0 p-2 opacity-30 ${bankInfo.textColor}`}>
                                {acc.type === 'CASH' ? <Wallet size={40} /> : <Landmark size={40} />}
                            </div>
                            <div className={bankInfo.textColor}>
                                <p className="text-xs font-medium opacity-90">{acc.bank}</p>
                                <p className="font-bold truncate">{acc.name}</p>
                            </div>
                            <p className={`text-lg font-bold mt-2 ${bankInfo.textColor}`}>${acc.balance.toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <ArrowUpRight size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Me Deben</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">${stats.totalLoansGiven.toLocaleString()}</p>
            </Card>
            <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <ArrowDownLeft size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Yo Debo</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">${stats.totalLoansTaken.toLocaleString()}</p>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <History size={16} className="text-slate-400" /> Movimientos Recientes
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
                {recentTransactions.length === 0 ? <div className="p-4 text-center text-sm text-slate-400">Sin movimientos aún</div> : (
                    recentTransactions.map((t: any) => (
                        <div key={t.id} className="p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${t.type === TransactionType.EXPENSE ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                    {t.type === TransactionType.EXPENSE ? <Minus size={14}/> : <TrendingUp size={14}/>}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{t.description}</p>
                                    <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                 <span className={`text-sm font-bold ${t.type === TransactionType.EXPENSE ? 'text-red-600' : 'text-green-600'}`}>
                                    {t.type === TransactionType.EXPENSE ? '-' : '+'}${t.amount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>
    );
};
