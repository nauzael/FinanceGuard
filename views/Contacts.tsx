
import React from 'react';

export const ContactsList = ({ contacts }: any) => (
     <div className="pb-20 animate-in fade-in">
        <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-4">Directorio</h2>
        <div className="grid grid-cols-1 gap-3">
            {contacts.map((c: any) => (
                <div key={c.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                     <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold">{c.name.charAt(0)}</div>
                     <div><p className="font-bold">{c.name}</p><p className="text-xs text-slate-500">{c.relation || 'Contacto'}</p></div>
                </div>
            ))}
        </div>
     </div>
);
