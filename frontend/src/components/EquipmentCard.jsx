import React from 'react';
import { Calendar, User, AlertTriangle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function EquipmentCard({ item, onDispatch, onReturn }) {
  const isRented = item.status === 'Rented Out';

  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden shadow-lg flex flex-col justify-between hover:border-amber-500/50 transition-all">
      <div>
        <div className="bg-[#0f172a] px-4 py-2.5 border-b border-slate-700 flex justify-between items-center">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
            isRented 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            ● {item.status}
          </span>
          <span className="text-[11px] font-mono text-slate-400">{item.serialNo}</span>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
          <p className="text-xs text-amber-500 font-semibold mb-4">{item.category}</p>

          <div className="space-y-2.5 text-xs text-slate-300 bg-[#0f172a]/60 p-3.5 rounded border border-slate-800">
            {isRented ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Customer: <strong className="text-white">{item.customerName}</strong> ({item.customerPhone})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Issued: {item.issueDate} | <span className="text-amber-400 font-bold">Return: {item.returnDate}</span></span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Available for immediate lease</span>
              </div>
            )}

            <div className="flex items-start gap-2 pt-1 border-t border-slate-800">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium">Pre-issue Condition: </span>
                <span className="text-slate-200">{item.preDefects || 'None (Mint Condition)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        {isRented ? (
          <button onClick={() => onReturn(item)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
            <ArrowDownLeft className="w-4 h-4" /> Receive & Check Defects
          </button>
        ) : (
          <button onClick={() => onDispatch(item)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
            <ArrowUpRight className="w-4 h-4" /> Issue Item to Customer
          </button>
        )}
      </div>
    </div>
  );
}