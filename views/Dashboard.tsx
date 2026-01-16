
import React from 'react';
import { Landmark, Plus, Wallet, ArrowUpRight, ArrowDownLeft, History, Minus, TrendingUp, Bell, Sparkles, RefreshCcw } from 'lucide-react';
import { Card, COLOMBIAN_BANKS } from '../components/UI.tsx';
import { TransactionType, View, LoanStatus } from '../types.ts';

export const Dashboard = ({ stats, accounts, recentTransactions, loans, onAddAccount, onEditAccount, onSetView, onRefreshAI, isAILoading }: any) => {
    const bankAccounts = accounts.filter((a: any) => a.type !== 'CASH');
    const totalInBanks = bankAccounts.reduce((sum: number, a: any) => sum + a.balance, 0);

    const todayStr = new Date().toLocaleDateString();
    const loansDueToday = (loans || []).filter((l: any) => {
        if (!l.dueDate || l.status === LoanStatus.PAID) return false;
        return new Date(l.dueDate).toLocaleDateString() === todayStr;
    });

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-300">
          
          {/* Alerta de pagos hoy */}
          {loansDueToday.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 animate-pulse">
                  <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full h-fit text-amber-600 dark:text-amber-400">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100">¡Atención!</p>
                    <p className="text-xs text-amber-800 dark:text-amber-300">Tienes {loansDueToday.length} pago(s) que vencen hoy.</p>
                    <button onClick={() => onSetView(View.LOANS)} className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 underline">Ver Préstamos</button>
                  </div>
              </div>
          )}

          {/* Asesor Financiero IA */}
          <Card className="bg-gradient-to-br from-indigo-500/10 via-brand-500/5 to-slate-500/10 border-indigo-100 dark:border-indigo-900/30 overflow-hidden relative">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={16} className="animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Asesor FinanceGuard IA</span>
                </div>
                <button 
                  onClick={onRefreshAI} 
                  disabled={isAILoading}
                  className={`p-1 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all ${isAILoading ? 'animate-spin' : ''}`}
                >
                  <RefreshCcw size={14} className="text-slate-400" />
                </button>
            </div>
            <div className="relative z-10">
                {isAILoading ? (
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        {stats.aiInsight || "Hola, soy tu asistente. Presiona el botón de actualizar para recibir un consejo financiero basado en tus movimientos actuales."}
                    </p>
                )}
            </div>
          </Card>

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
                        <div key={acc.id} onClick={() => onEditAccount?.(acc)} className="min-w-[160px] p-4 rounded-xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden cursor-pointer active:scale-95 transition-transform" style={{ backgroundColor: acc.color }}>
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
            <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none shadow-lg shadow-brand-500/20">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <ArrowUpRight size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Me Deben</span>
              </div>
              <p className="text-xl font-bold tracking-tight">${stats.totalLoansGiven.toLocaleString()}</p>
            </Card>
            <Card className="bg-white dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <ArrowDownLeft size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Yo Debo</span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">${stats.totalLoansTaken.toLocaleString()}</p>
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
                                <div className="max-w-[150px]">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{t.description}</p>
                                    <p className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
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