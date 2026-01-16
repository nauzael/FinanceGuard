
import React from 'react';
import { X, TrendingUp, Minus, DollarSign } from 'lucide-react';

export const COLOMBIAN_BANKS = [
    { id: 'efectivo', name: 'Efectivo', color: '#22c55e', textColor: 'text-white' },
    { id: 'bancolombia', name: 'Bancolombia', color: '#FDDA24', textColor: 'text-black' },
    { id: 'nequi', name: 'Nequi', color: '#200020', textColor: 'text-white' },
    { id: 'daviplata', name: 'Daviplata', color: '#EF3340', textColor: 'text-white' },
    { id: 'davivienda', name: 'Davivienda', color: '#EF3340', textColor: 'text-white' },
    { id: 'bbva', name: 'BBVA', color: '#004481', textColor: 'text-white' },
    { id: 'bogota', name: 'Banco de Bogotá', color: '#0033A0', textColor: 'text-white' },
    { id: 'nubank', name: 'Nu', color: '#820AD1', textColor: 'text-white' },
    { id: 'lulo', name: 'Lulo Bank', color: '#00F000', textColor: 'text-black' },
    { id: 'cajasocial', name: 'Caja Social', color: '#004885', textColor: 'text-white' },
    { id: 'otro', name: 'Otro', color: '#64748b', textColor: 'text-white' }
];

export const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 transition-colors ${className}`}>
    {children}
  </div>
);

export const Button = ({ onClick, variant = 'primary', className = '', children, disabled = false, type = 'button' }: any) => {
  const baseStyle = "px-4 py-3 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants: any = {
    primary: "bg-brand-600 text-white shadow-brand-200 dark:shadow-none shadow-md hover:bg-brand-700 disabled:opacity-50",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30",
    success: "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700",
    outline: "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
    <input className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white" {...props} />
  </div>
);

export const Select = ({ label, children, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
    <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" {...props}>
      {children}
    </select>
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const ActionMenu = ({ isOpen, onClose, onAddIncome, onAddExpense, onAddLoan }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-4 space-y-3 animate-in slide-in-from-bottom duration-200 mb-16 sm:mb-0" onClick={e => e.stopPropagation()}>
                <h3 className="text-center font-bold text-slate-900 dark:text-slate-100 mb-2">¿Qué quieres registrar?</h3>
                <button onClick={() => { onAddIncome(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-emerald-500"><TrendingUp size={20} /></div>
                    <div className="text-left"><span className="block font-bold">Registrar Ingreso</span><span className="text-xs opacity-70">Aumenta tu saldo</span></div>
                </button>
                <button onClick={() => { onAddExpense(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-red-500"><Minus size={20} /></div>
                    <div className="text-left"><span className="block font-bold">Registrar Gasto</span><span className="text-xs opacity-70">Disminuye tu saldo</span></div>
                </button>
                <button onClick={() => { onAddLoan(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-blue-500"><DollarSign size={20} /></div>
                    <div className="text-left"><span className="block font-bold">Nuevo Préstamo</span><span className="text-xs opacity-70">Dinero prestado</span></div>
                </button>
            </div>
        </div>
    );
};
